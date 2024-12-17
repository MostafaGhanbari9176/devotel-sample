import { Injectable } from "@nestjs/common";
import { initializeApp } from "firebase/app";
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  revokeAccessToken
} from "firebase/auth";
import * as admin from "firebase-admin";
import { auth, credential } from "firebase-admin";
import { ConfigService } from "@nestjs/config";
import { IdentityDto } from "../dto/identity.dto";
import { UserRole } from "../user/entities/user.entity";

@Injectable()
export class FirebaseService {
  private firebaseAuth: Auth;
  private firebaseAdmin: auth.Auth;

  private readonly apiKey: string;
  private readonly authDomain: string;
  private readonly projectId: string;
  private readonly storageBucket: string;
  private readonly messagingSenderId: string;
  private readonly appId: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = configService.get<string>("FA_API_KEY");
    this.authDomain = configService.get<string>("FA_AUTH_DOMAIN");
    this.projectId = configService.get<string>("FA_PROJECT_ID");
    this.storageBucket = configService.get<string>("FA_STORAGE_BUCKET");
    this.messagingSenderId = configService.get<string>(
      "FA_MESSAGING_SENDER_ID"
    );
    this.appId = configService.get<string>("FA_APP_ID");
    this.initFirebase();
  }

  initFirebase() {
    const fireBaseApp = initializeApp({
      apiKey: this.apiKey,
      authDomain: this.authDomain,
      projectId: this.projectId,
      storageBucket: this.storageBucket,
      messagingSenderId: this.messagingSenderId,
      appId: this.appId
    });
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: ""
    });

    this.firebaseAdmin = admin.auth();
    this.firebaseAuth = getAuth(fireBaseApp);
  }

  async signup(
    email: string,
    password: string,
    role: UserRole = UserRole.Simple
  ): Promise<{ uid: string, token: string, refreshToken: string, expirationTime: string }> {
    const userCredential = await createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    );
    await this.firebaseAdmin.setCustomUserClaims(userCredential.user.uid, {
      role
    });

    const tokenDetail = await userCredential.user.getIdTokenResult();

    return {
      uid: userCredential.user.uid,
      token: tokenDetail.token,
      expirationTime: tokenDetail.expirationTime,
      refreshToken: userCredential.user.refreshToken
    };
  }

  async login(email: string, password: string): Promise<{ uid: string, token: string, refreshToken: string, expirationTime: string }> {
    const userCredential = await signInWithEmailAndPassword(this.firebaseAuth, email, password);
    const tokenDetail = await userCredential.user.getIdTokenResult();

    return {
      uid: userCredential.user.uid,
      token: tokenDetail.token,
      expirationTime: tokenDetail.expirationTime,
      refreshToken: userCredential.user.refreshToken
    };
  }

  async refresh(refreshToken:string){

  }

  async validateToken(token: string): Promise<IdentityDto> {
    const decodedToken = await this.firebaseAdmin.verifyIdToken(token);

    return {
      userRole:decodedToken.role,
      username:decodedToken.uid,
      token
    };
  }

  async logout(token: string) {
    await revokeAccessToken(this.firebaseAuth, token)
  }
}

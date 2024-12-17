import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { UserDetailDto, UserDTO } from './dto/user-entity.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async emailIsExists(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ where: { email: email } });

    return !!user;
  }

  async signup(data: SignUpDto) {
    const user = await this.userModel.create({ ...data });
    //sending data to firebase
  }

  async userIsExists(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ where: { email: email } });
    return user != undefined;
  }

  async login(data: LoginDto) {
    //check user credential with firebase
  }

  async pagedList(
    page: number,
    limit: number,
  ): Promise<{ users: UserDTO[]; pageCount: number }> {
    const offset = (page - 1) * limit;
    const result = await this.userModel.findAndCountAll({
      limit: limit,
      offset: offset,
      order:[["createdAt", "DESC"]]
    });

    return {
      users: result.rows,
      pageCount: result.count,
    };
  }

  async findOne(username: string): Promise<UserDetailDto | undefined> {
    const user = await this.userModel.findByPk(username);

    return user;
  }

  async update(username: string, data: UpdateUserDto): Promise<boolean> {
    const user = await this.userModel.findByPk(username);

    if (!user) return false;

    await user.update({ ...data });

    return true;
  }

  async remove(username: string): Promise<boolean> {
    const user = await this.userModel.findByPk(username);

    if (!user) return false;

    await user.destroy({ force: true });

    return true;
  }
}



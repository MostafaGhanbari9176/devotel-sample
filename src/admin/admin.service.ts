import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UserDetailDto, UserDTO } from "../user/dto/user-entity.dto";
import { UpdateUserDto } from "../user/dto/update-user.dto";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "../user/entities/user.entity";
import { FirebaseService } from "../firebase/firebase.service";

@Injectable()
export class AdminService {

  constructor(
    @InjectModel(User) private userModel: typeof User
  ) {}

  async pagedList(
    page: number,
    limit: number,
  ): Promise<{ users: UserDTO[], pageCount: number }> {
    const offset = (page - 1) * limit;
    const result = await this.userModel.findAndCountAll({
      limit: limit,
      offset: offset,
      order:[["createdAt", "DESC"]],
      attributes:['username', 'email', 'role']
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

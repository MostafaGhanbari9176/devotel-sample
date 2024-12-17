import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { UUIDV4 } from "sequelize";
import { Post } from "../../post/entities/post.entity";

export enum UserRole {
  Admin = 'Admin',
  Simple = 'Simple',
}

@Table({createdAt:true, updatedAt:true})
export class User extends Model{

  @Column({
    allowNull:false,
    primaryKey:true,
    type:DataType.UUIDV4,
    defaultValue:UUIDV4
  })
  username:string

  @Column({ unique: true, allowNull: false })
  email: string;

  @Column({ defaultValue: UserRole.Simple})
  role: UserRole;

  @Column({ allowNull: true })
  firstname: string;

  @Column({ allowNull: true })
  lastname: string;

  @HasMany(() => Post, {onDelete:"CASCADE", onUpdate:"CASCADE"})
  posts: Post[];
}

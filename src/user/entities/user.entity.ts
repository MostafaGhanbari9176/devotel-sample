import { Column, HasMany, Table } from 'sequelize-typescript';

enum UserRole {
  Admin = 'Admin',
  Simple = 'Simple',
}

@Table
export class User {

  @Column({unique: true})
  username:string

  @Column({ unique: true, allowNull: false })
  email: string;

  @Column({ defaultValue: UserRole.Simple})
  role: UserRole;

  @Column({ allowNull: true })
  firstname: string;

  @Column({ allowNull: true })
  lastname: string;

  @HasMany(() => undefined) //fix after adding posts model
  posts: any[];
}

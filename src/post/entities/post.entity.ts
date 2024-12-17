import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';

@Table({ createdAt: true, updatedAt:true })
export class Post extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUIDV4,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ allowNull: false })
  title: string;

  @Column({ allowNull: false })
  content: string;

  @Column({ allowNull: true, defaultValue: '' })
  imagePath: string;

  @ForeignKey(() => User)
  @Column
  creatorUserName: string;

  @BelongsTo(() => User)
  creator: User;
}

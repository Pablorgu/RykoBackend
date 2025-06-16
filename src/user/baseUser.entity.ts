import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  TableInheritance,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { UserType } from './userType.enum';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
@Unique(['username'])
@Unique(['email'])
export abstract class BaseUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserType,
    name: 'type',
  })
  type: UserType;
}

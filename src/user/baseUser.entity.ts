import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  TableInheritance,
  PrimaryColumn,
  Unique,
} from 'typeorm';

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

  @Column()
  password: string;
}

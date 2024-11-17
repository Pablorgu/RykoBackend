import { Entity, Column } from 'typeorm';
import { BaseUser } from './baseUser.entity';

@Entity()
export class User extends BaseUser {
  @Column({ type: 'string' })
  username: string;

  @Column({ type: 'float' })
  weight: number;

  @Column({ type: 'int' })
  height: number;

  @Column({ type: 'date' })
  birthdate: Date;

  @Column({
    type: 'enum',
    enum: ['lose weight', 'maintain weight', 'gain weight'],
  })
  aim: 'lose weight' | 'maintain weight' | 'gain weight';

  @Column({ type: 'int' })
  calorie_goal: number;
}

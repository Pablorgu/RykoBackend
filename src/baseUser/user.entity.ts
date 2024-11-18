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
    enum: ['weight_loss', 'weight_maintain', 'weight_gain'],
  })
  aim: 'weight_loss' | 'weight_maintain' | 'weight_gain';

  @Column({ type: 'int' })
  calorie_goal: number;
}

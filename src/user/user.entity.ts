import { Entity, Column, ChildEntity, Unique,} from 'typeorm';
import { BaseUser } from './baseUser.entity';

@ChildEntity('user')
export class User extends BaseUser {

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

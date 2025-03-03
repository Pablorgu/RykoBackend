import { Entity, Column, ChildEntity, Unique,} from 'typeorm';
import { BaseUser } from './baseUser.entity';
import { Transform } from 'class-transformer';
import { Matches } from 'class-validator';

@ChildEntity('user')
export class User extends BaseUser {

  @Column({ type: 'float',nullable: true })
  weight?: number;

  @Column({ type: 'int', nullable: true })
  height?: number;

  @Column({ type: 'varchar', nullable: true })
  birthdate?: string

  @Column({
    type: 'enum',
    enum: ['weight_loss', 'weight_maintain', 'weight_gain'],
    nullable : true
  })
  aim?: 'weight_loss' | 'weight_maintain' | 'weight_gain';

  @Column({ type: 'int', nullable: true })
  calorie_goal?: number;
}

import { Entity, Column, ChildEntity, Unique, } from 'typeorm';
import { BaseUser } from './baseUser.entity';

@ChildEntity('user')
export class User extends BaseUser {

  @Column({ nullable: true })
  country?: string;

  @Column({ type: 'enum', enum: ['male', 'female', 'other'], nullable: true })
  gender?: 'male' | 'female' | 'other';

  @Column({ type: 'float', nullable: true })
  weight?: number;

  @Column({ type: 'int', nullable: true })
  height?: number;

  @Column({ type: 'varchar', nullable: true })
  birthdate?: string

  @Column({
    type: 'enum',
    enum: ['weight_loss', 'weight_maintain', 'weight_gain'],
    nullable: true
  })
  aim?: 'weight_loss' | 'weight_maintain' | 'weight_gain';

  @Column({ type: 'int', nullable: true })
  calorieGoal?: number;

  @Column("simple-array", { nullable: true })
  intolerances: string[];
}

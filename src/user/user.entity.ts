import { Entity, Column, ChildEntity, Unique, Check, OneToMany } from 'typeorm';
import { BaseUser } from './baseUser.entity';
import { Gender } from './enums/gender.enum';
import { WeightAim } from './enums/weightAim.enum';
import { Day } from 'src/day/day.entity';

@ChildEntity('user')
@Check('protein_pct + carbs_pct + fat_pct = 100')
export class User extends BaseUser {
  @Column({ nullable: true })
  country?: string;
  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender?: 'male' | 'female' | 'other';

  @Column({ type: 'float', nullable: true })
  weight?: number;

  @Column({ type: 'int', nullable: true })
  height?: number;

  @Column({ type: 'varchar', nullable: true })
  birthdate?: string;

  @Column({
    type: 'enum',
    enum: WeightAim,
    nullable: true,
  })
  aim?: 'weight_loss' | 'weight_maintain' | 'weight_gain';

  @Column({ type: 'int', nullable: true })
  calorieGoal?: number;

  @Column('simple-array', { nullable: true })
  intolerances: string[];

  @Column({ type: 'smallint', default: 30 })
  proteinPct: number;

  @Column({ type: 'smallint', default: 45 })
  carbsPct: number;

  @Column({ type: 'smallint', default: 25 })
  fatPct: number;

  @OneToMany(() => Day, (day) => day.user)
  days: Day[];
}

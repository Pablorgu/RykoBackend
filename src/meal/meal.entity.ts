import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Unique,
  JoinColumn,
} from 'typeorm';
import { Day } from '../day/day.entity';
import { MealDish } from '../mealDish/mealDish.entity';
import { MealTime } from './enums/mealTime.enum';

@Entity()
@Unique(['day', 'type']) // ← un único tipo por día
export class Meal {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Day, (day) => day.meals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'day_id' })
  day: Day;

  @Column({ type: 'enum', enum: MealTime })
  type: MealTime;

  @OneToMany(() => MealDish, (mealDish) => mealDish.meal, { cascade: true })
  mealDishes: MealDish[];
}

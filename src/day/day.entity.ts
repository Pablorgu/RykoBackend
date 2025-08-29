import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Meal } from '../meal/meal.entity';
import { User } from 'src/user/user.entity';

@Entity()
@Unique(['user', 'date'])
export class Day {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.days, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 10 })
  date: string; // YYYY-MM-DD

  @OneToMany(() => Meal, (meal) => meal.day, { cascade: true })
  meals: Meal[];
}

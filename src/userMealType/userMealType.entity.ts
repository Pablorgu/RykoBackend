import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Meal } from 'src/meal/meal.entity';

@Entity()
@Unique(['user', 'order'])
export class UserMealType {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Meal, { onDelete: 'CASCADE' })
  meal: Meal;

  @Column()
  name: string;

  @Column()
  order: number;
}

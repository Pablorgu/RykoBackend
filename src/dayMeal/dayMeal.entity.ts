import { Day } from "src/day/day.entity";
import { Meal } from "src/meal/meal.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class DayMeal {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Day, (day) => day.dayMeals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'day_id' })
  day: Day;

  @ManyToOne(() => Meal, (meal) => meal.dayMeals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meal_id' })
  meal: Meal;
}

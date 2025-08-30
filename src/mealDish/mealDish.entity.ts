import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Unique,
  JoinColumn,
  Column,
} from 'typeorm';
import { Meal } from '../meal/meal.entity';
import { Dish } from '../dish/dish.entity';
import { MealDishFooditem } from '../mealDishFoodItem/mealDishFoodItem.entity';
import { FoodItem } from 'src/foodItem/foodItem.entity';

@Entity()
export class MealDish {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Meal, (meal) => meal.mealDishes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meal_id' })
  meal: Meal;

  @ManyToOne(() => Dish, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dish_id' })
  dish: Dish;

  // Opcional: para ordenar platos en una misma comida (frontend)
  @Column({ type: 'int', default: 0 })
  position: number;

  @OneToMany(() => MealDishFooditem, (item) => item.mealDish, {
    cascade: true,
  })
  foodItems: MealDishFooditem[];
}

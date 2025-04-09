import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Meal } from 'src/meal/meal.entity';
import { Dish } from 'src/dish/dish.entity';
import { FoodItem } from 'src/foodItem/foodItem.entity';

@Entity()
export class MealDishFoodItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Meal, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meal_id' })
  meal: Meal;

  @ManyToOne(() => Dish, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dish_id' })
  dish: Dish;

  @ManyToOne(() => FoodItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'food_item_id' })
  foodItem: FoodItem;

  @Column('float')
  quantity: number;

  @Column({ type: 'varchar' })
  unit: string;
}

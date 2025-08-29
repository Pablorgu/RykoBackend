import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  JoinColumn,
} from 'typeorm';
import { MealDish } from '../mealDish/mealDish.entity';
import { FoodItem } from '../foodItem/foodItem.entity';

@Entity()
@Unique(['mealDish', 'foodItem']) // un ingrediente único por MealDish
export class MealDishFooditem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MealDish, (mealDish) => mealDish.foodItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'meal_dish_id' })
  mealDish: MealDish;

  @ManyToOne(() => FoodItem, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'food_item_barcode' })
  foodItem: FoodItem;

  @Column({ type: 'int' })
  quantity: number;
}

import { Dish } from 'src/dish/dish.entity';
import { FoodItem } from 'src/foodItem/foodItem.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['dish', 'foodItem'])
export class DishFoodItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Dish, (dish) => dish.dishFoodItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dish_id' })
  dish: Dish;

  @ManyToOne(() => FoodItem, (foodItem) => foodItem.dishFoodItems)
  @JoinColumn({ name: 'food_item_id' })
  foodItem: FoodItem;

  @Column({ type: 'int' })
  quantity: number; // Cantidad en gramos
}

import { Dish } from "src/dish/dish.entity";
import { FoodItem } from "src/foodItem/foodItem.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DishFoodItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Dish, (dish) => dish.dishFoodItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dish_id' })
  dish: Dish;

  @ManyToOne(() => FoodItem, (foodItem) => foodItem.dishFoodItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'food_item_id' })
  foodItem: FoodItem;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number; // Default quantity

  @Column({ nullable: true })
  unit: string;
}

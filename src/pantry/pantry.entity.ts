import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { User } from 'src/user/user.entity';
import { FoodItem } from 'src/foodItem/foodItem.entity';

@Entity()
export class Pantry {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => FoodItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'food_item_id' })
  foodItem: FoodItem;

  @Column('float')
  quantity: number;

  @Column('float')
  quantityToBuy: number;

  @Column('varchar')
  unit: string;
}

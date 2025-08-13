import { DishFoodItem } from 'src/dishFoodItem/dishFoodItem.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Dish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column({ type: 'varchar', nullable: true })
  image?: string;

  @Column({ type: 'int' })
  UserId: number;

  @OneToMany(() => DishFoodItem, (item) => item.dish)
  dishFoodItems: any;
}

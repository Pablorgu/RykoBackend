import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Meal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  time: string;

  @Column({ type: 'int' })
  MealTypeId: number;
  dayMeals: any;
}

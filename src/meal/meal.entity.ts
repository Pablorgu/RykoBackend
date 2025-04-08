import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Meal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  time: string;

  dayMeals: any;
}

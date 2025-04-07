import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Day } from "src/day/day.entity";
import { User } from "src/user/user.entity";

@Entity()
export class DayUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Day, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'day_id' })
  day: Day;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

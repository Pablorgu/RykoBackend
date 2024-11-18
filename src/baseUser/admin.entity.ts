import { Entity, Column } from 'typeorm';
import { BaseUser } from './baseUser.entity';

@Entity()
export class Admin extends BaseUser {
  @Column({ type: 'string' })
  username: string;
}

import { Entity } from 'typeorm';
import { BaseUser } from './baseUser.entity';
import { type } from 'os';

@Entity()
export class Admin extends BaseUser {
  @type({ type: 'string' })
  username: string;
}

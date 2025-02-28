  import { Entity, Column, ChildEntity} from 'typeorm';
  import { BaseUser } from './baseUser.entity';

  @ChildEntity('admin')
  export class Admin extends BaseUser {
  }

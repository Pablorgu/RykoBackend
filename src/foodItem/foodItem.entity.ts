import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Unique,
  JoinTable,
} from 'typeorm';

@Entity()
@Unique(['barcode'])
export class FoodItem {
  @PrimaryColumn({ type: 'bigint' })
  barcode: number;

  @Column({ type: 'varchar', default: 'unknown' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  brand?: string;

  @Column({ type: 'float', nullable: true })
  packageQuantity?: number;

  @Column({ type: 'varchar', nullable: true })
  allergens?: string;

  @Column({ type: 'longtext', nullable: true })
  ingredients?: string;

  @Column({ type: 'boolean', nullable: true })
  glutenFree?: boolean;

  @Column({ type: 'boolean', nullable: true })
  vegan?: boolean;

  @Column({ type: 'boolean', nullable: true })
  vegetarian?: boolean;

  @Column({ type: 'boolean', nullable: true })
  palmOil?: boolean;

  @Column({ type: 'varchar', nullable: true })
  imageFrontSmallUrl?: string;

  @Column({ type: 'varchar', nullable: true })
  imageFrontThumbUrl?: string;

  @Column({ type: 'varchar', nullable: true })
  imageFrontUrl?: string;

  @Column({ type: 'varchar', nullable: true })
  imageUrl?: string;

  @Column({ type: 'varchar', length: 7, nullable: true })
  nutriscore?: string;

  @Column({ type: 'float', nullable: true })
  energyKcal?: number;

  @Column({ type: 'float', nullable: true })
  energyKj?: number;

  @Column({ type: 'float' })
  carbohydrates: number;

  @Column({ type: 'float' })
  fat: number;

  @Column({ type: 'float' })
  proteins: number;

  @Column({ type: 'float', default: 0 })
  saturatedFat: number;

  @Column({ type: 'float', nullable: true })
  fiber?: number;

  @Column({ type: 'float', nullable: true })
  salt?: number;

  @Column({ type: 'float', nullable: true })
  alcohol?: number;

  @Column({ type: 'float', nullable: true })
  sodium?: number;

  @Column({ type: 'float' })
  sugars: number;

  @Column({ type: 'integer', nullable: true })
  novaGroup?: number;

  @Column({ type: 'varchar', nullable: true })
  additives?: string;

  @Column({ type: 'date', nullable: true })
  lastCheck?: Date;

  @Column({ type: 'boolean', default: false })
  isPersonal: boolean;

  @Column({ type: 'varchar', nullable: true })
  creator?: string;
  dishFoodItems: any;
}

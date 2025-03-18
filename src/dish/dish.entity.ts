import { Entity,Column, PrimaryGeneratedColumn, } from "typeorm";

@Entity()
export class Dish {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar'})
    name: string;

    @Column({type: 'varchar', nullable: true})
    description?: string;

    @Column({type: 'varchar', nullable: true})
    image?: string;

    @Column({type: 'int'})
    UserId: number;
}
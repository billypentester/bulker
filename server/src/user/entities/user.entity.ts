import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: Number;

    @Column()
    name: String;

    @Column()
    email: String;

    @Column()
    phone: String;

    @Column()
    gender: String;

    @Column({ unique: true })
    coupon: String;

}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, nullable: false, unique: true })
  name: string;

  @Column({ length: 500, nullable: false })
  password: string;
}

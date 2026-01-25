import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500, nullable: false, unique: true })
  username: string;

  @Column({ length: 500, nullable: false })
  password: string;
}

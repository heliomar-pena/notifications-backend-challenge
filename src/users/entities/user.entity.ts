import { IsEmail } from 'class-validator';
import { Notification } from 'src/notifications/entities/notification.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500, nullable: false, unique: true })
  @IsEmail()
  email: string;

  @Column({ length: 500, nullable: false })
  password: string;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}

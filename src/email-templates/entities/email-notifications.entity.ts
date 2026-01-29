import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Notification } from '../../notifications/entities/notification.entity';

@Entity()
export class EmailNotifications {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  template_id: string;

  @OneToOne(() => Notification)
  @JoinColumn()
  notification: Notification;
}

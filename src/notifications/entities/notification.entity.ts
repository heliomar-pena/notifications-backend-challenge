import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChannelValues } from '../../enums/channel.enum';
import { User } from 'src/users/entities/user.entity';
import {
  NotificationStatus,
  NotificationStatusValues,
} from 'src/enums/notification-status.enum';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  content: string;

  @Column({ type: 'enum', enum: ChannelValues, nullable: false })
  channel: string;

  @Column({
    type: 'enum',
    enum: NotificationStatusValues,
    nullable: false,
    default: NotificationStatus.CREATED,
  })
  status: string;

  @Column({ type: 'simple-array', nullable: false })
  destinations: string[];

  @ManyToOne(() => User, (user) => user.notifications, { nullable: false })
  user: User;
}

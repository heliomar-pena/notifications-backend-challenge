import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel, ChannelValues } from '../enums/channel.enum';
import { User } from 'src/users/entities/user.entity';
import {
  NotificationStatus,
  NotificationStatusValues,
} from 'src/notifications/enums/notification-status.enum';
import type { NotificationStatusType } from 'src/notifications/enums/notification-status.enum';
import type { ChannelValuesType } from '../enums/channel.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: '1234',
    description:
      'The ID for the notification. Use this ID along all your operations.',
  })
  id: string;

  @Column({ nullable: false })
  @ApiProperty({
    example: 'My great notification',
    description:
      'Title will be used as subject in email notifications, and as header in SMS and Push notification.',
  })
  title: string;

  @Column({ nullable: false })
  @ApiProperty({
    example: 'Hello world!',
    description:
      'Content is valid only for SMS and PUSH notification, will be ignored in Email notifications.',
  })
  content: string;

  @Column({ type: 'enum', enum: ChannelValues, nullable: false })
  @ApiProperty({
    enum: Channel,
    example: Channel.SMS,
    examples: ChannelValues,
    description: 'The channel that will be used for sending the notification.',
  })
  channel: ChannelValuesType;

  @Column({ unique: true, nullable: true })
  @ApiProperty({
    description:
      'The external reference for the notification. This ID is created for the notification provided used for each channel.',
  })
  reference_id: string;

  @Column({
    type: 'enum',
    enum: NotificationStatusValues,
    nullable: false,
    default: NotificationStatus.CREATED,
  })
  @ApiProperty({
    enum: NotificationStatus,
    example: NotificationStatus.CREATED,
  })
  status: NotificationStatusType;

  @Column({ type: 'simple-array', nullable: false })
  @ApiProperty({
    type: [String],
    example: ['+5491112345678'],
    description:
      "The destination where the notification will be sent. If channel is SMS, it has to be a valid phone number, if it's e-mail, then must be an e-mail and if it's Push notification a valid mobile token.",
  })
  destinations: string[];

  @ManyToOne(() => User, (user) => user.notifications, { nullable: false })
  user: User;

  @DeleteDateColumn()
  deleted_at?: Date;
}

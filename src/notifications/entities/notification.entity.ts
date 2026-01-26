import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { ChannelValues } from '../../enums/channel.enum';

export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  content: string;

  @Column({ type: 'enum', enum: ChannelValues, nullable: false })
  channel: string;
}

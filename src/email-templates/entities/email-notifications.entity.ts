import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Notification } from '../../notifications/entities/notification.entity';
import { EmailTemplates } from './email-templates.entity';
import { TemplateVariable } from 'resend';

@Entity()
export class EmailNotifications {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('json')
  variables: TemplateVariable[];

  @OneToOne(() => Notification)
  @JoinColumn()
  notification: Notification;

  @ManyToOne(
    () => EmailTemplates,
    (emailTemplates) => emailTemplates.emailNotifications,
  )
  @JoinColumn()
  template: EmailTemplates;
}

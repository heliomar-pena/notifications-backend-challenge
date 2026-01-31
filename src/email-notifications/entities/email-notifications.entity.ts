import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Notification } from '../../notifications/entities/notification.entity';
import { EmailTemplates } from '../../email-templates/entities/email-templates.entity';

@Entity()
export class EmailNotifications {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json', nullable: true })
  variables: Record<string, string | number>;

  @OneToOne(() => Notification)
  @JoinColumn()
  notification: Notification;

  @ManyToOne(
    () => EmailTemplates,
    (emailTemplates) => emailTemplates.emailNotifications,
  )
  @JoinColumn()
  template: EmailTemplates;

  @DeleteDateColumn()
  deletedAt?: Date;
}

import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmailNotifications } from '../../email-notifications/entities/email-notifications.entity';

@Entity()
export class EmailTemplates {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  template_id: string;

  @ManyToOne(() => User, (user) => user.email_templates)
  @JoinColumn()
  user: User;

  @OneToMany(
    () => EmailNotifications,
    (emailNotification) => emailNotification.template,
  )
  email_notifications: EmailNotifications[];
}

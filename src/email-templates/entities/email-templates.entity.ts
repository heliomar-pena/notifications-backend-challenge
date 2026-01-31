import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmailNotifications } from '../../email-notifications/entities/email-notifications.entity';

@Entity()
export class EmailTemplates {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  template_id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(
    () => EmailNotifications,
    (emailNotification) => emailNotification.template,
  )
  emailNotifications: EmailNotifications[];
}

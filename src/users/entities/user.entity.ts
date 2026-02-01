import { IsEmail } from 'class-validator';
import { EmailTemplates } from 'src/email-templates/entities/email-templates.entity';
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

  @OneToMany(() => EmailTemplates, (emailTemplate) => emailTemplate.user)
  email_templates: EmailTemplates[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}

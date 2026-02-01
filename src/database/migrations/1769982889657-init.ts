import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1769982889657 implements MigrationInterface {
    name = 'Init1769982889657'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notification_channel_enum" AS ENUM('email', 'sms', 'push')`);
        await queryRunner.query(`CREATE TYPE "public"."notification_status_enum" AS ENUM('created', 'sent')`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "content" character varying NOT NULL, "channel" "public"."notification_channel_enum" NOT NULL, "reference_id" character varying, "status" "public"."notification_status_enum" NOT NULL DEFAULT 'created', "destinations" text NOT NULL, "deletedAt" TIMESTAMP, "userId" uuid NOT NULL, CONSTRAINT "UQ_fdf14a3114b0236cc2a94470781" UNIQUE ("reference_id"), CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "email_notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "variables" json, "deletedAt" TIMESTAMP, "notificationId" uuid, "templateId" uuid, CONSTRAINT "REL_3295d8d00b6ecaf262ea3216f1" UNIQUE ("notificationId"), CONSTRAINT "PK_f4d8ce5003f1ce04365090df2d2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "email_templates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "template_id" character varying NOT NULL, "userId" uuid, CONSTRAINT "UQ_7df8a0c6b71357f6a622aad4899" UNIQUE ("template_id"), CONSTRAINT "PK_06c564c515d8cdb40b6f3bfbbb4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(500) NOT NULL, "password" character varying(500) NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email_notifications" ADD CONSTRAINT "FK_3295d8d00b6ecaf262ea3216f1b" FOREIGN KEY ("notificationId") REFERENCES "notification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email_notifications" ADD CONSTRAINT "FK_22e67663780a7ffb451af214d69" FOREIGN KEY ("templateId") REFERENCES "email_templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email_templates" ADD CONSTRAINT "FK_852f7f5b1c08289d94df1b05fb5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_templates" DROP CONSTRAINT "FK_852f7f5b1c08289d94df1b05fb5"`);
        await queryRunner.query(`ALTER TABLE "email_notifications" DROP CONSTRAINT "FK_22e67663780a7ffb451af214d69"`);
        await queryRunner.query(`ALTER TABLE "email_notifications" DROP CONSTRAINT "FK_3295d8d00b6ecaf262ea3216f1b"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "email_templates"`);
        await queryRunner.query(`DROP TABLE "email_notifications"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TYPE "public"."notification_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notification_channel_enum"`);
    }

}

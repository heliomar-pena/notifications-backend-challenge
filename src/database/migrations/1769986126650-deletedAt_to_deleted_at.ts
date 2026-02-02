import { MigrationInterface, QueryRunner } from "typeorm";

export class DeletedAtToDeletedAt1769986126650 implements MigrationInterface {
    name = 'DeletedAtToDeletedAt1769986126650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" RENAME COLUMN "deletedAt" TO "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "email_notifications" RENAME COLUMN "deletedAt" TO "deleted_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_notifications" RENAME COLUMN "deleted_at" TO "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "notification" RENAME COLUMN "deleted_at" TO "deletedAt"`);
    }

}

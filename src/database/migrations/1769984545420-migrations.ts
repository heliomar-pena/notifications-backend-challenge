import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1769984545420 implements MigrationInterface {
    name = 'Migrations1769984545420'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_templates" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_templates" DROP COLUMN "deleted_at"`);
    }

}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1769983092656 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'INSERT INTO "user" (id, email, password) VALUES ($1, $2, $3);',
      [
        'f7b910df-a19d-4c98-8ff0-74308d400f6d',
        'john.doe@acme.com',
        '$2b$10$O..N/4HoyuGysJlyRDykDel5nAVs3mCodpHy.SPL.yIuwVBmc502K',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "user" WHERE id = $1;', [
      'f7b910df-a19d-4c98-8ff0-74308d400f6d',
    ]);
  }
}

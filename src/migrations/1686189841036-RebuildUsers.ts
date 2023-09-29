import { MigrationInterface, QueryRunner } from 'typeorm';

export class RebuildUsers1686189841036 implements MigrationInterface {
  name = 'RebuildUsers1686189841036';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "username" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
  }
}

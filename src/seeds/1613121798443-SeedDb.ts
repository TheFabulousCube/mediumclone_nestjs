import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1613121798443 implements MigrationInterface {
  name = 'SeedDb1613121798443';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('nestjs')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExpandUserPasswordColumn1777010000000
  implements MigrationInterface
{
  name = 'ExpandUserPasswordColumn1777010000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" TYPE character varying(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" TYPE character varying(32)`,
    );
  }
}

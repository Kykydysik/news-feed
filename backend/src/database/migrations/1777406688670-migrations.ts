import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1777406688670 implements MigrationInterface {
    name = 'Migrations1777406688670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."reports_type_enum" AS ENUM('news')`);
        await queryRunner.query(`CREATE TYPE "public"."reports_status_enum" AS ENUM('process', 'ready', 'error')`);
        await queryRunner.query(`CREATE TABLE "reports" ("id" SERIAL NOT NULL, "type" "public"."reports_type_enum" NOT NULL, "status" "public"."reports_status_enum" NOT NULL, CONSTRAINT "PK_d9013193989303580053c0b5ef6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2026-04-28T20:04:50.540Z'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2026-04-28T20:04:50.540Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2026-04-28 19:59:59.209+00'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2026-04-28 19:59:59.209+00'`);
        await queryRunner.query(`DROP TABLE "reports"`);
        await queryRunner.query(`DROP TYPE "public"."reports_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."reports_type_enum"`);
    }

}

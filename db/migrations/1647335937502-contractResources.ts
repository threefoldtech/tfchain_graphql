import {MigrationInterface, QueryRunner} from "typeorm";

export class contractResources1647335937502 implements MigrationInterface {
    name = 'contractResources1647335937502'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "nru_consumption" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP DEFAULT now(), "updated_by_id" character varying, "deleted_at" TIMESTAMP, "deleted_by_id" character varying, "version" integer NOT NULL, "contract_id" integer NOT NULL, "timestamp" integer NOT NULL, "window" numeric, "nru" numeric, CONSTRAINT "PK_ca7956fb8fcdb7198737387d9a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public"."node_contract" ADD "resources_used" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."node_contract" DROP COLUMN "resources_used"`);
        await queryRunner.query(`DROP TABLE "nru_consumption"`);
    }

}

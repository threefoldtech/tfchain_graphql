import {MigrationInterface, QueryRunner} from "typeorm";

export class rentContracts1647440583479 implements MigrationInterface {
    name = 'rentContracts1647440583479'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rent_contract" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP DEFAULT now(), "updated_by_id" character varying, "deleted_at" TIMESTAMP, "deleted_by_id" character varying, "version" integer NOT NULL, "contract_id" integer NOT NULL, "node_id" integer NOT NULL, "twin_id" integer NOT NULL, "state" character varying NOT NULL, CONSTRAINT "PK_3c99766b627604d5950d704e33a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "rent_contract"`);
    }

}

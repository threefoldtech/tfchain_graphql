import {MigrationInterface, QueryRunner} from "typeorm";

export class nodeExtend1645095234713 implements MigrationInterface {
    name = 'nodeExtend1645095234713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."node" ADD "secure" boolean`);
        await queryRunner.query(`ALTER TABLE "public"."node" ADD "virtualized" boolean`);
        await queryRunner.query(`ALTER TABLE "public"."node" ADD "serial_number" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."node" DROP COLUMN "serial_number"`);
        await queryRunner.query(`ALTER TABLE "public"."node" DROP COLUMN "virtualized"`);
        await queryRunner.query(`ALTER TABLE "public"."node" DROP COLUMN "secure"`);
    }

}

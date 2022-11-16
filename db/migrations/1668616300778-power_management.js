module.exports = class power_management1668616300778 {
  name = "power_management1668616300778";

  async up(db) {
    await db.query(
      `CREATE TABLE "node_consumable_resources" ("id" character varying NOT NULL, "total" jsonb NOT NULL, "used" jsonb, "node_id" character varying NOT NULL, CONSTRAINT "REL_4db566d46cee02edd8d909031a" UNIQUE ("node_id"), CONSTRAINT "PK_b8139023fc17a6dfa27ed05e52a" PRIMARY KEY ("id"))`
    );
    await db.query(
      `CREATE UNIQUE INDEX "IDX_4db566d46cee02edd8d909031a" ON "node_consumable_resources" ("node_id") `
    );
    await db.query(
      `CREATE TABLE "node_power" ("id" character varying NOT NULL, "target" character varying(4), "state" character varying(4), "last_uptime" numeric, "node_id" character varying NOT NULL, CONSTRAINT "REL_66baaf0b7bad0c93ce841a9e58" UNIQUE ("node_id"), CONSTRAINT "PK_2a4f76caa15ed3174994959c62c" PRIMARY KEY ("id"))`
    );
    await db.query(
      `CREATE UNIQUE INDEX "IDX_66baaf0b7bad0c93ce841a9e58" ON "node_power" ("node_id") `
    );
    await db.query(
      `CREATE TABLE "capacity_reservation_contract" ("id" character varying NOT NULL, "contract_id" numeric NOT NULL, "node_id" integer NOT NULL, "resources" jsonb NOT NULL, "public_i_ps" integer NOT NULL, "state" character varying(11) NOT NULL, CONSTRAINT "PK_24125d5b7cfefa2073d73c17fa4" PRIMARY KEY ("id"))`
    );
    await db.query(
      `CREATE TABLE "deployment_contract_resources" ("id" character varying NOT NULL, "hru" numeric NOT NULL, "sru" numeric NOT NULL, "cru" numeric NOT NULL, "mru" numeric NOT NULL, "contract_id" character varying NOT NULL, CONSTRAINT "PK_a4dd4a9907279eb36ff32281e8a" PRIMARY KEY ("id"))`
    );
    await db.query(
      `CREATE INDEX "IDX_d112ff4f45cfd4fe655dd60f7c" ON "deployment_contract_resources" ("contract_id") `
    );
    await db.query(
      `CREATE TABLE "deployment_contract" ("id" character varying NOT NULL, "contract_id" numeric NOT NULL, "twin_id" integer NOT NULL, "capacity_reservation_id" numeric NOT NULL, "deployment_data" text NOT NULL, "deployment_hash" text NOT NULL, "number_of_public_i_ps" integer NOT NULL, "public_ips" jsonb, "state" character varying(11) NOT NULL, "created_at" numeric NOT NULL, "solution_provider_id" integer, "resources_used_id" character varying, CONSTRAINT "PK_a6eb6232afec32ef8d89a9e348e" PRIMARY KEY ("id"))`
    );
    await db.query(
      `CREATE INDEX "IDX_eca3b438281ab192e16373473e" ON "deployment_contract" ("resources_used_id") `
    );
    await db.query(
      `ALTER TABLE "node_consumable_resources" ADD CONSTRAINT "FK_4db566d46cee02edd8d909031a1" FOREIGN KEY ("node_id") REFERENCES "node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await db.query(
      `ALTER TABLE "node_power" ADD CONSTRAINT "FK_66baaf0b7bad0c93ce841a9e582" FOREIGN KEY ("node_id") REFERENCES "node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await db.query(
      `ALTER TABLE "deployment_contract_resources" ADD CONSTRAINT "FK_d112ff4f45cfd4fe655dd60f7c4" FOREIGN KEY ("contract_id") REFERENCES "deployment_contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await db.query(
      `ALTER TABLE "deployment_contract" ADD CONSTRAINT "FK_eca3b438281ab192e16373473ef" FOREIGN KEY ("resources_used_id") REFERENCES "deployment_contract_resources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  async down(db) {
    await db.query(`DROP TABLE "node_consumable_resources"`);
    await db.query(`DROP INDEX "public"."IDX_4db566d46cee02edd8d909031a"`);
    await db.query(`DROP TABLE "node_power"`);
    await db.query(`DROP INDEX "public"."IDX_66baaf0b7bad0c93ce841a9e58"`);
    await db.query(`DROP TABLE "capacity_reservation_contract"`);
    await db.query(`DROP TABLE "deployment_contract_resources"`);
    await db.query(`DROP INDEX "public"."IDX_d112ff4f45cfd4fe655dd60f7c"`);
    await db.query(`DROP TABLE "deployment_contract"`);
    await db.query(`DROP INDEX "public"."IDX_eca3b438281ab192e16373473e"`);
    await db.query(
      `ALTER TABLE "node_consumable_resources" DROP CONSTRAINT "FK_4db566d46cee02edd8d909031a1"`
    );
    await db.query(
      `ALTER TABLE "node_power" DROP CONSTRAINT "FK_66baaf0b7bad0c93ce841a9e582"`
    );
    await db.query(
      `ALTER TABLE "deployment_contract_resources" DROP CONSTRAINT "FK_d112ff4f45cfd4fe655dd60f7c4"`
    );
    await db.query(
      `ALTER TABLE "deployment_contract" DROP CONSTRAINT "FK_eca3b438281ab192e16373473ef"`
    );
  }
};

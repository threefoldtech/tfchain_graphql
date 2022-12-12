module.exports = class power_mngmt1670852577609 {
  name = 'power_mngmt1670852577609'

  async up(db) {
    await db.query(`CREATE TABLE "node_consumable_resources" ("id" character varying NOT NULL, "total" jsonb NOT NULL, "used" jsonb NOT NULL, "node_id" character varying NOT NULL, CONSTRAINT "REL_4db566d46cee02edd8d909031a" UNIQUE ("node_id"), CONSTRAINT "PK_b8139023fc17a6dfa27ed05e52a" PRIMARY KEY ("id"))`)
    await db.query(`CREATE UNIQUE INDEX "IDX_4db566d46cee02edd8d909031a" ON "node_consumable_resources" ("node_id") `)
    await db.query(`CREATE TABLE "node_power" ("id" character varying NOT NULL, "target" character varying(4), "state" character varying(4), "last_uptime" numeric, "node_id" character varying NOT NULL, CONSTRAINT "REL_66baaf0b7bad0c93ce841a9e58" UNIQUE ("node_id"), CONSTRAINT "PK_2a4f76caa15ed3174994959c62c" PRIMARY KEY ("id"))`)
    await db.query(`CREATE UNIQUE INDEX "IDX_66baaf0b7bad0c93ce841a9e58" ON "node_power" ("node_id") `)
    await db.query(`CREATE TABLE "consumable_resources" ("id" character varying NOT NULL, "total" jsonb NOT NULL, "used" jsonb NOT NULL, "contract_id" character varying NOT NULL, CONSTRAINT "REL_87ad1aaaf2ed5e62565831811b" UNIQUE ("contract_id"), CONSTRAINT "PK_f9ae83e9a102ba2ef9f80929746" PRIMARY KEY ("id"))`)
    await db.query(`CREATE UNIQUE INDEX "IDX_87ad1aaaf2ed5e62565831811b" ON "consumable_resources" ("contract_id") `)
    await db.query(`CREATE TABLE "capacity_reservation_contract" ("id" character varying NOT NULL, "contract_id" numeric NOT NULL, "node_id" integer NOT NULL, "public_i_ps" integer NOT NULL, "state" character varying(11) NOT NULL, CONSTRAINT "PK_24125d5b7cfefa2073d73c17fa4" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "deployment_resources" ("id" character varying NOT NULL, "hru" numeric NOT NULL, "sru" numeric NOT NULL, "cru" numeric NOT NULL, "mru" numeric NOT NULL, "contract_id" character varying NOT NULL, CONSTRAINT "PK_c6e3a69f7b9bb63ccc82e4ef213" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_110ad3a72d8cd9fc5a3d72dd83" ON "deployment_resources" ("contract_id") `)
    await db.query(`CREATE TABLE "deployment" ("id" character varying NOT NULL, "deployment_id" numeric NOT NULL, "twin_id" integer NOT NULL, "capacity_reservation_id" numeric NOT NULL, "deployment_data" text NOT NULL, "deployment_hash" text NOT NULL, "number_of_public_i_ps" integer NOT NULL, "public_ips" jsonb, "created_at" numeric NOT NULL, "resources_id" character varying, CONSTRAINT "PK_ee1f952fc81f37c6fea69c2e248" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_c6e3a69f7b9bb63ccc82e4ef21" ON "deployment" ("resources_id") `)
    await db.query(`ALTER TABLE "node_consumable_resources" ADD CONSTRAINT "FK_4db566d46cee02edd8d909031a1" FOREIGN KEY ("node_id") REFERENCES "node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "node_power" ADD CONSTRAINT "FK_66baaf0b7bad0c93ce841a9e582" FOREIGN KEY ("node_id") REFERENCES "node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "consumable_resources" ADD CONSTRAINT "FK_87ad1aaaf2ed5e62565831811b4" FOREIGN KEY ("contract_id") REFERENCES "capacity_reservation_contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "deployment_resources" ADD CONSTRAINT "FK_110ad3a72d8cd9fc5a3d72dd833" FOREIGN KEY ("contract_id") REFERENCES "deployment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "deployment" ADD CONSTRAINT "FK_c6e3a69f7b9bb63ccc82e4ef213" FOREIGN KEY ("resources_id") REFERENCES "deployment_resources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`DROP TABLE "node_consumable_resources"`)
    await db.query(`DROP INDEX "public"."IDX_4db566d46cee02edd8d909031a"`)
    await db.query(`DROP TABLE "node_power"`)
    await db.query(`DROP INDEX "public"."IDX_66baaf0b7bad0c93ce841a9e58"`)
    await db.query(`DROP TABLE "consumable_resources"`)
    await db.query(`DROP INDEX "public"."IDX_87ad1aaaf2ed5e62565831811b"`)
    await db.query(`DROP TABLE "capacity_reservation_contract"`)
    await db.query(`DROP TABLE "deployment_resources"`)
    await db.query(`DROP INDEX "public"."IDX_110ad3a72d8cd9fc5a3d72dd83"`)
    await db.query(`DROP TABLE "deployment"`)
    await db.query(`DROP INDEX "public"."IDX_c6e3a69f7b9bb63ccc82e4ef21"`)
    await db.query(`ALTER TABLE "node_consumable_resources" DROP CONSTRAINT "FK_4db566d46cee02edd8d909031a1"`)
    await db.query(`ALTER TABLE "node_power" DROP CONSTRAINT "FK_66baaf0b7bad0c93ce841a9e582"`)
    await db.query(`ALTER TABLE "consumable_resources" DROP CONSTRAINT "FK_87ad1aaaf2ed5e62565831811b4"`)
    await db.query(`ALTER TABLE "deployment_resources" DROP CONSTRAINT "FK_110ad3a72d8cd9fc5a3d72dd833"`)
    await db.query(`ALTER TABLE "deployment" DROP CONSTRAINT "FK_c6e3a69f7b9bb63ccc82e4ef213"`)
  }
}

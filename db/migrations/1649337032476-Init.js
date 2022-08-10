module.exports = class Init1649337032476 {
  name = 'Init1649337032476'

  async up(db) {
    await db.query(`CREATE TABLE "historical_balance" ("id" character varying NOT NULL, "balance" numeric NOT NULL, "timestamp" numeric NOT NULL, "account_id" character varying NOT NULL, CONSTRAINT "PK_74ac29ad0bdffb6d1281a1e17e8" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_383ff006e4b59db91d32cb891e" ON "historical_balance" ("account_id") `)
    await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, "wallet" text NOT NULL, "balance" numeric NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "transfer" ("id" character varying NOT NULL, "from" text NOT NULL, "to" text NOT NULL, "amount" numeric NOT NULL, "timestamp" numeric NOT NULL, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "entity" ("id" character varying NOT NULL, "grid_version" integer NOT NULL, "entity_id" integer NOT NULL, "name" text NOT NULL, "country" text, "city" text, "account_id" text NOT NULL, CONSTRAINT "PK_50a7741b415bc585fcf9c984332" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "twin" ("id" character varying NOT NULL, "grid_version" integer NOT NULL, "twin_id" integer NOT NULL, "account_id" text NOT NULL, "ip" text NOT NULL, CONSTRAINT "PK_18457170fa91d0a787d9f635d7c" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "entity_proof" ("id" character varying NOT NULL, "entity_id" integer NOT NULL, "signature" text NOT NULL, "twin_rel_id" character varying NOT NULL, CONSTRAINT "PK_b55dee5f461106682013d0beef8" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_3d9cbf30c68b79a801e1d5c9b4" ON "entity_proof" ("twin_rel_id") `)
    await db.query(`CREATE TABLE "public_ip" ("id" character varying NOT NULL, "gateway" text NOT NULL, "ip" text NOT NULL, "contract_id" numeric NOT NULL, "farm_id" character varying NOT NULL, CONSTRAINT "PK_f170b0b519632730f41d2ef78f4" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_5cc2d1af1d8132b614abd340b0" ON "public_ip" ("farm_id") `)
    await db.query(`CREATE TABLE "farm" ("id" character varying NOT NULL, "grid_version" integer NOT NULL, "farm_id" integer NOT NULL, "name" text NOT NULL, "twin_id" integer NOT NULL, "pricing_policy_id" integer NOT NULL, "certification_type" character varying(9) NOT NULL, "stellar_address" text, "dedicated_farm" boolean, CONSTRAINT "PK_3bf246b27a3b6678dfc0b7a3f64" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "location" ("id" character varying NOT NULL, "longitude" text NOT NULL, "latitude" text NOT NULL, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "public_config" ("id" character varying NOT NULL, "ipv4" text, "ipv6" text, "gw4" text, "gw6" text, "domain" text, "node_id" character varying NOT NULL, CONSTRAINT "REL_d394b8b9afbb1b1a2346f9743c" UNIQUE ("node_id"), CONSTRAINT "PK_7839f7dd8f45e37933fb3e35cbb" PRIMARY KEY ("id"))`)
    await db.query(`CREATE UNIQUE INDEX "IDX_d394b8b9afbb1b1a2346f9743c" ON "public_config" ("node_id") `)
    await db.query(`CREATE TABLE "node_resources_total" ("id" character varying NOT NULL, "hru" numeric NOT NULL, "sru" numeric NOT NULL, "cru" numeric NOT NULL, "mru" numeric NOT NULL, "node_id" character varying NOT NULL, CONSTRAINT "REL_fd430c3a2645c8f409f859c2aa" UNIQUE ("node_id"), CONSTRAINT "PK_964127f256a8ffeba2aa31c098d" PRIMARY KEY ("id"))`)
    await db.query(`CREATE UNIQUE INDEX "IDX_fd430c3a2645c8f409f859c2aa" ON "node_resources_total" ("node_id") `)
    await db.query(`CREATE TABLE "node_resources_used" ("id" character varying NOT NULL, "hru" numeric NOT NULL, "sru" numeric NOT NULL, "cru" numeric NOT NULL, "mru" numeric NOT NULL, "node_id" character varying NOT NULL, CONSTRAINT "REL_75870a8ed1c14efd1dd4ef4792" UNIQUE ("node_id"), CONSTRAINT "PK_05bf9bc81d419c0f34c8bf08d5f" PRIMARY KEY ("id"))`)
    await db.query(`CREATE UNIQUE INDEX "IDX_75870a8ed1c14efd1dd4ef4792" ON "node_resources_used" ("node_id") `)
    await db.query(`CREATE TABLE "node_resources_free" ("id" character varying NOT NULL, "hru" numeric NOT NULL, "sru" numeric NOT NULL, "cru" numeric NOT NULL, "mru" numeric NOT NULL, "node_id" character varying NOT NULL, CONSTRAINT "REL_923c4dff43306d0a0f5a98a1ab" UNIQUE ("node_id"), CONSTRAINT "PK_0a15fb3f274365eef34123c2dea" PRIMARY KEY ("id"))`)
    await db.query(`CREATE UNIQUE INDEX "IDX_923c4dff43306d0a0f5a98a1ab" ON "node_resources_free" ("node_id") `)
    await db.query(`CREATE TABLE "interfaces" ("id" character varying NOT NULL, "name" text NOT NULL, "mac" text NOT NULL, "ips" text NOT NULL, "node_id" character varying NOT NULL, CONSTRAINT "PK_811ec6e568e3c1a89ac5e744731" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_23937641f28c607f061dab4694" ON "interfaces" ("node_id") `)
    await db.query(`CREATE TABLE "node" ("id" character varying NOT NULL, "grid_version" integer NOT NULL, "node_id" integer NOT NULL, "farm_id" integer NOT NULL, "twin_id" integer NOT NULL, "country" text, "city" text, "uptime" numeric, "created" integer NOT NULL, "farming_policy_id" integer NOT NULL, "certification_type" character varying(9), "secure" boolean, "virtualized" boolean, "serial_number" text, "created_at" numeric NOT NULL, "updated_at" numeric NOT NULL, "location_id" character varying NOT NULL, CONSTRAINT "PK_8c8caf5f29d25264abe9eaf94dd" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_d224b7b862841f24dd85b55605" ON "node" ("location_id") `)
    await db.query(`CREATE TABLE "pricing_policy" ("id" character varying NOT NULL, "grid_version" integer NOT NULL, "pricing_policy_id" integer NOT NULL, "name" text NOT NULL, "su" jsonb NOT NULL, "cu" jsonb NOT NULL, "nu" jsonb NOT NULL, "ipu" jsonb NOT NULL, "foundation_account" text NOT NULL, "certified_sales_account" text NOT NULL, "dedicated_node_discount" integer NOT NULL, CONSTRAINT "PK_78105eb11bd75fd76a23bbc9bb1" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "country" ("id" character varying NOT NULL, "country_id" integer NOT NULL, "code" text NOT NULL, "name" text NOT NULL, "region" text NOT NULL, "subregion" text NOT NULL, "lat" text, "long" text, CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "city" ("id" character varying NOT NULL, "city_id" integer NOT NULL, "country_id" integer NOT NULL, "name" text NOT NULL, CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "contract_resources" ("id" character varying NOT NULL, "hru" numeric NOT NULL, "sru" numeric NOT NULL, "cru" numeric NOT NULL, "mru" numeric NOT NULL, "contract_id" character varying NOT NULL, CONSTRAINT "PK_557de19994fcca90916e8c6582f" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_621238dffde9099b2233650235" ON "contract_resources" ("contract_id") `)
    await db.query(`CREATE TABLE "node_contract" ("id" character varying NOT NULL, "grid_version" integer NOT NULL, "contract_id" numeric NOT NULL, "twin_id" integer NOT NULL, "node_id" integer NOT NULL, "deployment_data" text NOT NULL, "deployment_hash" text NOT NULL, "number_of_public_i_ps" integer NOT NULL, "state" character varying(11) NOT NULL, "created_at" numeric NOT NULL, "resources_used_id" character varying, CONSTRAINT "PK_a5f90b17f504ffcd79d1f66574a" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_f294cfb50bb7c7b976d86c08fd" ON "node_contract" ("resources_used_id") `)
    await db.query(`CREATE TABLE "name_contract" ("id" character varying NOT NULL, "grid_version" integer NOT NULL, "contract_id" numeric NOT NULL, "twin_id" integer NOT NULL, "name" text NOT NULL, "state" character varying(11) NOT NULL, "created_at" numeric NOT NULL, CONSTRAINT "PK_7b4cd056bbb83602d211996360f" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "rent_contract" ("id" character varying NOT NULL, "grid_version" integer NOT NULL, "contract_id" numeric NOT NULL, "twin_id" integer NOT NULL, "node_id" integer NOT NULL, "state" character varying(11) NOT NULL, "created_at" numeric NOT NULL, CONSTRAINT "PK_3c99766b627604d5950d704e33a" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "nru_consumption" ("id" character varying NOT NULL, "contract_id" numeric NOT NULL, "timestamp" numeric NOT NULL, "window" numeric, "nru" numeric, CONSTRAINT "PK_ca7956fb8fcdb7198737387d9a8" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "contract_bill_report" ("id" character varying NOT NULL, "contract_id" numeric NOT NULL, "discount_received" character varying(7) NOT NULL, "amount_billed" numeric NOT NULL, "timestamp" numeric NOT NULL, CONSTRAINT "PK_5b21fd81e47bddc5f1fdbc8d7ee" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "farming_policy" ("id" character varying NOT NULL, "grid_version" integer NOT NULL, "farming_policy_id" integer NOT NULL, "name" text NOT NULL, "cu" integer NOT NULL, "su" integer NOT NULL, "nu" integer NOT NULL, "ipv4" integer NOT NULL, "timestamp" numeric NOT NULL, "certification_type" character varying(9) NOT NULL, CONSTRAINT "PK_5d2ec9534104f44e4d989c4e82f" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "uptime_event" ("id" character varying NOT NULL, "node_id" integer NOT NULL, "uptime" numeric NOT NULL, "timestamp" numeric NOT NULL, CONSTRAINT "PK_90783463b0d0b660367ebd7f5ff" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "mint_transaction" ("id" character varying NOT NULL, "amount" numeric NOT NULL, "target" text NOT NULL, "block" integer NOT NULL, CONSTRAINT "PK_19f4328320501dfd14e2bae0855" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "burn_transaction" ("id" character varying NOT NULL, "block" integer NOT NULL, "amount" numeric NOT NULL, "target" text NOT NULL, CONSTRAINT "PK_20ec76c5c56dd6b47dec5f0aaa8" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "refund_transaction" ("id" character varying NOT NULL, "block" integer NOT NULL, "amount" numeric NOT NULL, "target" text NOT NULL, "tx_hash" text NOT NULL, CONSTRAINT "PK_74ffc5427c595968dd777f71bf4" PRIMARY KEY ("id"))`)
    await db.query(`ALTER TABLE "historical_balance" ADD CONSTRAINT "FK_383ff006e4b59db91d32cb891e9" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "entity_proof" ADD CONSTRAINT "FK_3d9cbf30c68b79a801e1d5c9b41" FOREIGN KEY ("twin_rel_id") REFERENCES "twin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "public_ip" ADD CONSTRAINT "FK_5cc2d1af1d8132b614abd340b06" FOREIGN KEY ("farm_id") REFERENCES "farm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "public_config" ADD CONSTRAINT "FK_d394b8b9afbb1b1a2346f9743cd" FOREIGN KEY ("node_id") REFERENCES "node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "node_resources_total" ADD CONSTRAINT "FK_fd430c3a2645c8f409f859c2aae" FOREIGN KEY ("node_id") REFERENCES "node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "node_resources_used" ADD CONSTRAINT "FK_75870a8ed1c14efd1dd4ef47921" FOREIGN KEY ("node_id") REFERENCES "node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "node_resources_free" ADD CONSTRAINT "FK_923c4dff43306d0a0f5a98a1aba" FOREIGN KEY ("node_id") REFERENCES "node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "interfaces" ADD CONSTRAINT "FK_23937641f28c607f061dab4694b" FOREIGN KEY ("node_id") REFERENCES "node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "node" ADD CONSTRAINT "FK_d224b7b862841f24dd85b556059" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "contract_resources" ADD CONSTRAINT "FK_621238dffde9099b2233650235d" FOREIGN KEY ("contract_id") REFERENCES "node_contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "node_contract" ADD CONSTRAINT "FK_f294cfb50bb7c7b976d86c08fda" FOREIGN KEY ("resources_used_id") REFERENCES "contract_resources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`DROP TABLE "historical_balance"`)
    await db.query(`DROP INDEX "public"."IDX_383ff006e4b59db91d32cb891e"`)
    await db.query(`DROP TABLE "account"`)
    await db.query(`DROP TABLE "transfer"`)
    await db.query(`DROP TABLE "entity"`)
    await db.query(`DROP TABLE "twin"`)
    await db.query(`DROP TABLE "entity_proof"`)
    await db.query(`DROP INDEX "public"."IDX_3d9cbf30c68b79a801e1d5c9b4"`)
    await db.query(`DROP TABLE "public_ip"`)
    await db.query(`DROP INDEX "public"."IDX_5cc2d1af1d8132b614abd340b0"`)
    await db.query(`DROP TABLE "farm"`)
    await db.query(`DROP TABLE "location"`)
    await db.query(`DROP TABLE "public_config"`)
    await db.query(`DROP INDEX "public"."IDX_d394b8b9afbb1b1a2346f9743c"`)
    await db.query(`DROP TABLE "node_resources_total"`)
    await db.query(`DROP INDEX "public"."IDX_fd430c3a2645c8f409f859c2aa"`)
    await db.query(`DROP TABLE "node_resources_used"`)
    await db.query(`DROP INDEX "public"."IDX_75870a8ed1c14efd1dd4ef4792"`)
    await db.query(`DROP TABLE "node_resources_free"`)
    await db.query(`DROP INDEX "public"."IDX_923c4dff43306d0a0f5a98a1ab"`)
    await db.query(`DROP TABLE "interfaces"`)
    await db.query(`DROP INDEX "public"."IDX_23937641f28c607f061dab4694"`)
    await db.query(`DROP TABLE "node"`)
    await db.query(`DROP INDEX "public"."IDX_d224b7b862841f24dd85b55605"`)
    await db.query(`DROP TABLE "pricing_policy"`)
    await db.query(`DROP TABLE "country"`)
    await db.query(`DROP TABLE "city"`)
    await db.query(`DROP TABLE "contract_resources"`)
    await db.query(`DROP INDEX "public"."IDX_621238dffde9099b2233650235"`)
    await db.query(`DROP TABLE "node_contract"`)
    await db.query(`DROP INDEX "public"."IDX_f294cfb50bb7c7b976d86c08fd"`)
    await db.query(`DROP TABLE "name_contract"`)
    await db.query(`DROP TABLE "rent_contract"`)
    await db.query(`DROP TABLE "nru_consumption"`)
    await db.query(`DROP TABLE "contract_bill_report"`)
    await db.query(`DROP TABLE "farming_policy"`)
    await db.query(`DROP TABLE "uptime_event"`)
    await db.query(`DROP TABLE "mint_transaction"`)
    await db.query(`DROP TABLE "burn_transaction"`)
    await db.query(`DROP TABLE "refund_transaction"`)
    await db.query(`ALTER TABLE "historical_balance" DROP CONSTRAINT "FK_383ff006e4b59db91d32cb891e9"`)
    await db.query(`ALTER TABLE "entity_proof" DROP CONSTRAINT "FK_3d9cbf30c68b79a801e1d5c9b41"`)
    await db.query(`ALTER TABLE "public_ip" DROP CONSTRAINT "FK_5cc2d1af1d8132b614abd340b06"`)
    await db.query(`ALTER TABLE "public_config" DROP CONSTRAINT "FK_d394b8b9afbb1b1a2346f9743cd"`)
    await db.query(`ALTER TABLE "node_resources_total" DROP CONSTRAINT "FK_fd430c3a2645c8f409f859c2aae"`)
    await db.query(`ALTER TABLE "node_resources_used" DROP CONSTRAINT "FK_75870a8ed1c14efd1dd4ef47921"`)
    await db.query(`ALTER TABLE "node_resources_free" DROP CONSTRAINT "FK_923c4dff43306d0a0f5a98a1aba"`)
    await db.query(`ALTER TABLE "interfaces" DROP CONSTRAINT "FK_23937641f28c607f061dab4694b"`)
    await db.query(`ALTER TABLE "node" DROP CONSTRAINT "FK_d224b7b862841f24dd85b556059"`)
    await db.query(`ALTER TABLE "contract_resources" DROP CONSTRAINT "FK_621238dffde9099b2233650235d"`)
    await db.query(`ALTER TABLE "node_contract" DROP CONSTRAINT "FK_f294cfb50bb7c7b976d86c08fda"`)
  }
}

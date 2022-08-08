module.exports = class contract-solutions-provider1659975848175 {
  name = 'contract-solutions-provider1659975848175'

  async up(db) {
    await db.query(`CREATE TABLE "provider" ("id" character varying NOT NULL, "who" text NOT NULL, "take" integer NOT NULL, "solution_provider_id" character varying NOT NULL, CONSTRAINT "PK_6ab2f66d8987bf1bfdd6136a2d5" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_350eaad6e4030988788edddc7d" ON "provider" ("solution_provider_id") `)
    await db.query(`CREATE TABLE "solution_provider" ("id" character varying NOT NULL, "solution_provider_id" integer NOT NULL, "description" text NOT NULL, "link" text NOT NULL, "approved" boolean NOT NULL, CONSTRAINT "PK_dbb1dd40ae8f70dc9bbe2ce6347" PRIMARY KEY ("id"))`)
    await db.query(`ALTER TABLE "node_contract" ADD "solution_provider_id" integer`)
    await db.query(`ALTER TABLE "name_contract" ADD "solution_provider_id" integer`)
    await db.query(`ALTER TABLE "rent_contract" ADD "solution_provider_id" integer`)
    await db.query(`ALTER TABLE "provider" ADD CONSTRAINT "FK_350eaad6e4030988788edddc7d3" FOREIGN KEY ("solution_provider_id") REFERENCES "solution_provider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`DROP TABLE "provider"`)
    await db.query(`DROP INDEX "public"."IDX_350eaad6e4030988788edddc7d"`)
    await db.query(`DROP TABLE "solution_provider"`)
    await db.query(`ALTER TABLE "node_contract" DROP COLUMN "solution_provider_id"`)
    await db.query(`ALTER TABLE "name_contract" DROP COLUMN "solution_provider_id"`)
    await db.query(`ALTER TABLE "rent_contract" DROP COLUMN "solution_provider_id"`)
    await db.query(`ALTER TABLE "provider" DROP CONSTRAINT "FK_350eaad6e4030988788edddc7d3"`)
  }
}

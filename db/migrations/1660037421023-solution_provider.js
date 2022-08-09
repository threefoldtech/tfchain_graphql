module.exports = class solution_provider1660037421023 {
  name = 'solution_provider1660037421023'

  async up(db) {
    await db.query(`CREATE TABLE "solution_provider" ("id" character varying NOT NULL, "solution_provider_id" numeric NOT NULL, "description" text NOT NULL, "link" text NOT NULL, "approved" boolean NOT NULL, "providers" jsonb, CONSTRAINT "PK_dbb1dd40ae8f70dc9bbe2ce6347" PRIMARY KEY ("id"))`)
    await db.query(`ALTER TABLE "node_contract" ADD "solution_provider_id" integer`)
    await db.query(`ALTER TABLE "name_contract" ADD "solution_provider_id" integer`)
    await db.query(`ALTER TABLE "rent_contract" ADD "solution_provider_id" integer`)
  }

  async down(db) {
    await db.query(`DROP TABLE "solution_provider"`)
    await db.query(`ALTER TABLE "node_contract" DROP COLUMN "solution_provider_id"`)
    await db.query(`ALTER TABLE "name_contract" DROP COLUMN "solution_provider_id"`)
    await db.query(`ALTER TABLE "rent_contract" DROP COLUMN "solution_provider_id"`)
  }
}

module.exports = class rentcontracts1649169010023 {
  name = 'rentcontracts1649169010023'

  async up(db) {
    await db.query(`CREATE TABLE "rent_contract" ("id" character varying NOT NULL, "version" integer NOT NULL, "contract_id" numeric NOT NULL, "twin_id" integer NOT NULL, "node_id" integer NOT NULL, "state" character varying(10) NOT NULL, CONSTRAINT "PK_3c99766b627604d5950d704e33a" PRIMARY KEY ("id"))`)
    await db.query(`ALTER TABLE "pricing_policy" ADD "dedicated_node_discount" integer NOT NULL`)
  }

  async down(db) {
    await db.query(`DROP TABLE "rent_contract"`)
    await db.query(`ALTER TABLE "pricing_policy" DROP COLUMN "dedicated_node_discount"`)
  }
}

module.exports = class node_power1675138223836 {
  name = 'node_power1675138223836'

  async up(db) {
    await db.query(`CREATE TABLE "node_power" ("id" character varying NOT NULL, "farm_id" integer NOT NULL, "node_id" integer NOT NULL, "state" character varying(4) NOT NULL, "target" character varying(4) NOT NULL, CONSTRAINT "PK_2a4f76caa15ed3174994959c62c" PRIMARY KEY ("id"))`)
  }

  async down(db) {
    await db.query(`DROP TABLE "node_power"`)
  }
}

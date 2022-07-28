module.exports = class graceperiod1653490002499 {
  name = 'graceperiod1653490002499'

  async up(db) {
    await db.query(`ALTER TABLE "node_contract" DROP COLUMN "state" CASCADE`)
    await db.query(`ALTER TABLE "node_contract" ADD "state" character varying(11)`)
    await db.query(`ALTER TABLE "name_contract" DROP COLUMN "state" CASCADE`)
    await db.query(`ALTER TABLE "name_contract" ADD "state" character varying(11)`)
    await db.query(`ALTER TABLE "rent_contract" DROP COLUMN "state" CASCADE`)
    await db.query(`ALTER TABLE "rent_contract" ADD "state" character varying(11)`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "node_contract" ADD "state" character varying(10)`)
    await db.query(`ALTER TABLE "node_contract" DROP COLUMN "state" CASCADE`)
    await db.query(`ALTER TABLE "name_contract" ADD "state" character varying(10)`)
    await db.query(`ALTER TABLE "name_contract" DROP COLUMN "state" CASCADE`)
    await db.query(`ALTER TABLE "rent_contract" ADD "state" character varying(10)`)
    await db.query(`ALTER TABLE "rent_contract" DROP COLUMN "state" CASCADE`)
  }
}

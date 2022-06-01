module.exports = class graceperiod1653490002499 {
  name = 'graceperiod1653490002499'

  async up(db) {
    await db.query(`ALTER TABLE "node_contract" DROP COLUMN "state"`)
    await db.query(`ALTER TABLE "node_contract" ADD "state" character varying(11) NOT NULL`)
    await db.query(`ALTER TABLE "name_contract" DROP COLUMN "state"`)
    await db.query(`ALTER TABLE "name_contract" ADD "state" character varying(11) NOT NULL`)
    await db.query(`ALTER TABLE "rent_contract" DROP COLUMN "state"`)
    await db.query(`ALTER TABLE "rent_contract" ADD "state" character varying(11) NOT NULL`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "node_contract" ADD "state" character varying(10) NOT NULL`)
    await db.query(`ALTER TABLE "node_contract" DROP COLUMN "state"`)
    await db.query(`ALTER TABLE "name_contract" ADD "state" character varying(10) NOT NULL`)
    await db.query(`ALTER TABLE "name_contract" DROP COLUMN "state"`)
    await db.query(`ALTER TABLE "rent_contract" ADD "state" character varying(10) NOT NULL`)
    await db.query(`ALTER TABLE "rent_contract" DROP COLUMN "state"`)
  }
}

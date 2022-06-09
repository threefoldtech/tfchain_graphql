module.exports = class dao1654761880386 {
  name = 'dao1654761880386'

  async up(db) {
    await db.query(`ALTER TABLE "farm" DROP COLUMN "certification_type"`)
    await db.query(`ALTER TABLE "farm" DROP COLUMN "dedicated_farm"`)
    await db.query(`ALTER TABLE "node" DROP COLUMN "certification_type"`)
    await db.query(`ALTER TABLE "farming_policy" DROP COLUMN "timestamp"`)
    await db.query(`ALTER TABLE "farming_policy" DROP COLUMN "certification_type"`)
    await db.query(`ALTER TABLE "farm" ADD "certification" character varying(12) NOT NULL`)
    await db.query(`ALTER TABLE "node" ADD "certification" character varying(9)`)
    await db.query(`ALTER TABLE "node" ADD "dedicated" boolean`)
    await db.query(`ALTER TABLE "farming_policy" ADD "minimal_uptime" integer NOT NULL`)
    await db.query(`ALTER TABLE "farming_policy" ADD "policy_created" numeric NOT NULL`)
    await db.query(`ALTER TABLE "farming_policy" ADD "policy_end" numeric NOT NULL`)
    await db.query(`ALTER TABLE "farming_policy" ADD "immutable" boolean`)
    await db.query(`ALTER TABLE "farming_policy" ADD "default" boolean`)
    await db.query(`ALTER TABLE "farming_policy" ADD "node_certification" character varying(9) NOT NULL`)
    await db.query(`ALTER TABLE "farming_policy" ADD "farm_certification" character varying(12) NOT NULL`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "farm" ADD "certification_type" character varying(9) NOT NULL`)
    await db.query(`ALTER TABLE "farm" ADD "dedicated_farm" boolean`)
    await db.query(`ALTER TABLE "node" ADD "certification_type" character varying(9)`)
    await db.query(`ALTER TABLE "farming_policy" ADD "timestamp" numeric NOT NULL`)
    await db.query(`ALTER TABLE "farming_policy" ADD "certification_type" character varying(9) NOT NULL`)
    await db.query(`ALTER TABLE "farm" DROP COLUMN "certification"`)
    await db.query(`ALTER TABLE "node" DROP COLUMN "certification"`)
    await db.query(`ALTER TABLE "node" DROP COLUMN "dedicated"`)
    await db.query(`ALTER TABLE "farming_policy" DROP COLUMN "minimal_uptime"`)
    await db.query(`ALTER TABLE "farming_policy" DROP COLUMN "policy_created"`)
    await db.query(`ALTER TABLE "farming_policy" DROP COLUMN "policy_end"`)
    await db.query(`ALTER TABLE "farming_policy" DROP COLUMN "immutable"`)
    await db.query(`ALTER TABLE "farming_policy" DROP COLUMN "default"`)
    await db.query(`ALTER TABLE "farming_policy" DROP COLUMN "node_certification"`)
    await db.query(`ALTER TABLE "farming_policy" DROP COLUMN "farm_certification"`)
  }
}

module.exports = class dao1655130809835 {
  name = 'dao1655130809835'

  async up(db) {
    await db.query(`ALTER TABLE "farm" RENAME COLUMN "certification_type" TO "certification"`)
    await db.query(`ALTER TABLE "node" DROP COLUMN "certification_type"`)
    await db.query(`ALTER TABLE "farming_policy" DROP COLUMN "timestamp"`)
    await db.query(`ALTER TABLE "farming_policy" DROP COLUMN "certification_type"`)
    await db.query(`ALTER TABLE "node" ADD "certification" character varying(9)`)
    await db.query(`ALTER TABLE "node" ADD "connection_price" integer`)
    await db.query(`ALTER TABLE "farming_policy" ADD "minimal_uptime" integer`)
    await db.query(`ALTER TABLE "farming_policy" ADD "policy_created" integer`)
    await db.query(`ALTER TABLE "farming_policy" ADD "policy_end" integer`)
    await db.query(`ALTER TABLE "farming_policy" ADD "immutable" boolean`)
    await db.query(`ALTER TABLE "farming_policy" ADD "default" boolean`)
    await db.query(`ALTER TABLE "farming_policy" ADD "node_certification" character varying(9)`)
    await db.query(`ALTER TABLE "farming_policy" ADD "farm_certification" character varying(12)`)
    await db.query(`ALTER TABLE "farm" DROP COLUMN "certification"`)
    await db.query(`ALTER TABLE "farm" ADD "certification" character varying(12)`)
    await db.query(`ALTER TABLE "farming_policy" ALTER COLUMN "name" DROP NOT NULL`)
    await db.query(`ALTER TABLE "farming_policy" ALTER COLUMN "cu" DROP NOT NULL`)
    await db.query(`ALTER TABLE "farming_policy" ALTER COLUMN "su" DROP NOT NULL`)
    await db.query(`ALTER TABLE "farming_policy" ALTER COLUMN "nu" DROP NOT NULL`)
    await db.query(`ALTER TABLE "farming_policy" ALTER COLUMN "ipv4" DROP NOT NULL`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "farm" RENAME COLUMN "certification" TO "certification_type"`)
    await db.query(`ALTER TABLE "node" ADD "certification_type" character varying(9)`)
    await db.query(`ALTER TABLE "farming_policy" ADD "timestamp" numeric NOT NULL`)
    await db.query(`ALTER TABLE "farming_policy" ADD "certification_type" character varying(9) NOT NULL`)
    await db.query(`ALTER TABLE "node" DROP COLUMN "certification"`)
    await db.query(`ALTER TABLE "node" DROP COLUMN "connection_price"`)
    await db.query(`ALTER TABLE "farming_policy" DROP COLUMN "minimal_uptime"`)
    await db.query(`ALTER TABLE "farming_policy" DROP COLUMN "policy_created"`)
    await db.query(`ALTER TABLE "farming_policy" DROP COLUMN "policy_end"`)
    await db.query(`ALTER TABLE "farming_policy" DROP COLUMN "immutable"`)
    await db.query(`ALTER TABLE "farming_policy" DROP COLUMN "default"`)
    await db.query(`ALTER TABLE "farming_policy" DROP COLUMN "node_certification"`)
    await db.query(`ALTER TABLE "farming_policy" DROP COLUMN "farm_certification"`)
    await db.query(`ALTER TABLE "farm" ADD "certification" character varying(9) NOT NULL`)
    await db.query(`ALTER TABLE "farm" DROP COLUMN "certification"`)
    await db.query(`ALTER TABLE "farming_policy" ALTER COLUMN "name" SET NOT NULL`)
    await db.query(`ALTER TABLE "farming_policy" ALTER COLUMN "cu" SET NOT NULL`)
    await db.query(`ALTER TABLE "farming_policy" ALTER COLUMN "su" SET NOT NULL`)
    await db.query(`ALTER TABLE "farming_policy" ALTER COLUMN "nu" SET NOT NULL`)
    await db.query(`ALTER TABLE "farming_policy" ALTER COLUMN "ipv4" SET NOT NULL`)
  }
}

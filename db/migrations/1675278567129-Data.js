module.exports = class Data1675278567129 {
    name = 'Data1675278567129'

    async up(db) {
        await db.query(`ALTER TABLE "node" ADD "power" jsonb`)
        await db.query(`ALTER TABLE "node" ALTER COLUMN "power" SET DEFAULT '{"state": "Up", "target": "Up"}'::jsonb`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "node" DROP COLUMN "power"`)
    }
}

module.exports = class Data1686656735316 {
    name = 'Data1686656735316'

    async up(db) {
        await db.query(`ALTER TABLE "node" ADD "has_gpu" boolean NOT NULL DEFAULT false`)
        await db.query(`ALTER TABLE "node" ALTER COLUMN "power" DROP DEFAULT`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "node" DROP COLUMN "has_gpu"`)
        await db.query(`ALTER TABLE "node" ALTER COLUMN "power" SET DEFAULT '{"state": "Up", "target": "Up"}'`)
    }
}
module.exports = class remove_node_gpu1690448468759 {
    name = 'remove_node_gpu1690448468759'

    async up(db) {
        await db.query(`ALTER TABLE "node" DROP COLUMN "has_gpu"`)
        await db.query(`ALTER TABLE "node" ALTER COLUMN "dedicated" DROP DEFAULT`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "node" ADD "has_gpu" boolean NOT NULL DEFAULT false`)
        await db.query(`ALTER TABLE "node" ALTER COLUMN "dedicated" SET DEFAULT false`)
    }
}

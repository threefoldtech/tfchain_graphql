module.exports = class node_price1686728671632 {
    name = 'node_price1686728671632'

    async up(db) {
        await db.query(`ALTER TABLE "node" ADD "dedicated" boolean NOT NULL DEFAULT false`)
        await db.query(`ALTER TABLE "node" ADD "extra_fee" numeric`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "node" DROP COLUMN "dedicated"`)
        await db.query(`ALTER TABLE "node" DROP COLUMN "extra_fee"`)
    }
}

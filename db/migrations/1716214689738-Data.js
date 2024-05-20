module.exports = class Data1716214689738 {
    name = 'Data1716214689738'

    async up(db) {
        await db.query(`CREATE TABLE "price_stored" ("id" character varying NOT NULL, "new_price" numeric NOT NULL, "block" integer NOT NULL, "timestamp" numeric NOT NULL, CONSTRAINT "PK_3d68b3171d32422894302e2a84a" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "average_price_stored" ("id" character varying NOT NULL, "new_average_price" numeric NOT NULL, "block" integer NOT NULL, "timestamp" numeric NOT NULL, CONSTRAINT "PK_aea4f921e532918be63485242ab" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "price_stored"`)
        await db.query(`DROP TABLE "average_price_stored"`)
    }
}

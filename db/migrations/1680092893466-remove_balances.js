module.exports = class remove_balances1680092893466 {
    name = 'remove_balances1680092893466'

    async up(db) {
        await db.query(`DROP TABLE "historical_balance"`)
        await db.query(`DROP TABLE "account"`)
        await db.query(`DROP TABLE "transfer"`)
    }

    async down(db) {
        await db.query(`CREATE TABLE "historical_balance" ("id" character varying NOT NULL, "balance" numeric NOT NULL, "timestamp" numeric NOT NULL, "account_id" character varying NOT NULL, CONSTRAINT "PK_74ac29ad0bdffb6d1281a1e17e8" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_383ff006e4b59db91d32cb891e" ON "historical_balance" ("account_id") `)
        await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, "wallet" text NOT NULL, "balance" numeric NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "transfer" ("id" character varying NOT NULL, "from" text NOT NULL, "to" text NOT NULL, "amount" numeric NOT NULL, "timestamp" numeric NOT NULL, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`)
    }
}

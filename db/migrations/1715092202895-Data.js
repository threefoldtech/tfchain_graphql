module.exports = class Data1715092202895 {
    name = 'Data1715092202895'

    async up(db) {
        await db.query(`CREATE TABLE "power_target_report" ("id" character varying NOT NULL, "farm_id" integer NOT NULL, "node_id" integer NOT NULL, "new_power_target" character varying(4) NOT NULL, "block" integer NOT NULL, "timestamp" numeric NOT NULL, CONSTRAINT "PK_815b6f599146c615b13292a875a" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "power_state_report" ("id" character varying NOT NULL, "farm_id" integer NOT NULL, "node_id" integer NOT NULL, "new_power_state" character varying(4) NOT NULL, "block" integer NOT NULL, "timestamp" numeric NOT NULL, CONSTRAINT "PK_040bf595115174cdc7070b39688" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "power_target_report"`)
        await db.query(`DROP TABLE "power_state_report"`)
    }
}

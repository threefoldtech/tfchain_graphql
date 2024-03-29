module.exports = class service_contract1672322090839 {
  name = 'service_contract1672322090839'

  async up(db) {
    await db.query(`CREATE TABLE "service_contract" ("id" character varying NOT NULL, "service_contract_id" numeric NOT NULL, "service_twin_id" integer NOT NULL, "consumer_twin_id" integer NOT NULL, "base_fee" numeric NOT NULL, "variable_fee" numeric NOT NULL, "metadata" text NOT NULL, "accepted_by_service" boolean NOT NULL, "accepted_by_consumer" boolean NOT NULL, "last_bill" numeric NOT NULL, "state" character varying(14) NOT NULL, CONSTRAINT "PK_ff58318f8230b8053067edd0343" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "service_contract_bill" ("id" character varying NOT NULL, "service_contract_id" numeric NOT NULL, "variable_amount" numeric NOT NULL, "window" numeric NOT NULL, "metadata" text, "amount" numeric NOT NULL, CONSTRAINT "PK_1fd26292c0913e974b774342fa7" PRIMARY KEY ("id"))`)
  }

  async down(db) {
    await db.query(`DROP TABLE "service_contract"`)
    await db.query(`DROP TABLE "service_contract_bill"`)
  }
}

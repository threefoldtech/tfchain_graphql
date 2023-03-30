module.exports = class Data1673510995256 {
    name = 'Data1673510995256'

    async up(db) {
        await db.query(`ALTER TABLE "twin" DROP COLUMN "ip"`)
        await db.query(`ALTER TABLE "twin" ADD "relay" text`)
        await db.query(`ALTER TABLE "twin" ADD "public_key" text`)
        await db.query(`ALTER TABLE "historical_balance" DROP CONSTRAINT "FK_383ff006e4b59db91d32cb891e9"`)
        await db.query(`ALTER TABLE "historical_balance" ALTER COLUMN "account_id" DROP NOT NULL`)
        await db.query(`ALTER TABLE "entity_proof" DROP CONSTRAINT "FK_3d9cbf30c68b79a801e1d5c9b41"`)
        await db.query(`ALTER TABLE "entity_proof" ALTER COLUMN "twin_rel_id" DROP NOT NULL`)
        await db.query(`ALTER TABLE "public_ip" DROP CONSTRAINT "FK_5cc2d1af1d8132b614abd340b06"`)
        await db.query(`ALTER TABLE "public_ip" ALTER COLUMN "farm_id" DROP NOT NULL`)
        await db.query(`ALTER TABLE "interfaces" DROP CONSTRAINT "FK_23937641f28c607f061dab4694b"`)
        await db.query(`ALTER TABLE "interfaces" ALTER COLUMN "node_id" DROP NOT NULL`)
        await db.query(`ALTER TABLE "node" DROP CONSTRAINT "FK_d224b7b862841f24dd85b556059"`)
        await db.query(`ALTER TABLE "node" ALTER COLUMN "location_id" DROP NOT NULL`)
        await db.query(`ALTER TABLE "contract_resources" DROP CONSTRAINT "FK_621238dffde9099b2233650235d"`)
        await db.query(`ALTER TABLE "contract_resources" ALTER COLUMN "contract_id" DROP NOT NULL`)
        await db.query(`ALTER TABLE "historical_balance" ADD CONSTRAINT "FK_383ff006e4b59db91d32cb891e9" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "entity_proof" ADD CONSTRAINT "FK_3d9cbf30c68b79a801e1d5c9b41" FOREIGN KEY ("twin_rel_id") REFERENCES "twin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "public_ip" ADD CONSTRAINT "FK_5cc2d1af1d8132b614abd340b06" FOREIGN KEY ("farm_id") REFERENCES "farm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "interfaces" ADD CONSTRAINT "FK_23937641f28c607f061dab4694b" FOREIGN KEY ("node_id") REFERENCES "node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "node" ADD CONSTRAINT "FK_d224b7b862841f24dd85b556059" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "contract_resources" ADD CONSTRAINT "FK_621238dffde9099b2233650235d" FOREIGN KEY ("contract_id") REFERENCES "node_contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "twin" DROP COLUMN "relay"`)
        await db.query(`ALTER TABLE "twin" ADD "ip" text`)
        await db.query(`ALTER TABLE "twin" DROP COLUMN "public_key"`)
        await db.query(`ALTER TABLE "historical_balance" ADD CONSTRAINT "FK_383ff006e4b59db91d32cb891e9" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "historical_balance" ALTER COLUMN "account_id" SET NOT NULL`)
        await db.query(`ALTER TABLE "entity_proof" ADD CONSTRAINT "FK_3d9cbf30c68b79a801e1d5c9b41" FOREIGN KEY ("twin_rel_id") REFERENCES "twin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "entity_proof" ALTER COLUMN "twin_rel_id" SET NOT NULL`)
        await db.query(`ALTER TABLE "public_ip" ADD CONSTRAINT "FK_5cc2d1af1d8132b614abd340b06" FOREIGN KEY ("farm_id") REFERENCES "farm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "public_ip" ALTER COLUMN "farm_id" SET NOT NULL`)
        await db.query(`ALTER TABLE "interfaces" ADD CONSTRAINT "FK_23937641f28c607f061dab4694b" FOREIGN KEY ("node_id") REFERENCES "node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "interfaces" ALTER COLUMN "node_id" SET NOT NULL`)
        await db.query(`ALTER TABLE "node" ADD CONSTRAINT "FK_d224b7b862841f24dd85b556059" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "node" ALTER COLUMN "location_id" SET NOT NULL`)
        await db.query(`ALTER TABLE "contract_resources" ADD CONSTRAINT "FK_621238dffde9099b2233650235d" FOREIGN KEY ("contract_id") REFERENCES "node_contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "contract_resources" ALTER COLUMN "contract_id" SET NOT NULL`)
        await db.query(`ALTER TABLE "historical_balance" DROP CONSTRAINT "FK_383ff006e4b59db91d32cb891e9"`)
        await db.query(`ALTER TABLE "entity_proof" DROP CONSTRAINT "FK_3d9cbf30c68b79a801e1d5c9b41"`)
        await db.query(`ALTER TABLE "public_ip" DROP CONSTRAINT "FK_5cc2d1af1d8132b614abd340b06"`)
        await db.query(`ALTER TABLE "interfaces" DROP CONSTRAINT "FK_23937641f28c607f061dab4694b"`)
        await db.query(`ALTER TABLE "node" DROP CONSTRAINT "FK_d224b7b862841f24dd85b556059"`)
        await db.query(`ALTER TABLE "contract_resources" DROP CONSTRAINT "FK_621238dffde9099b2233650235d"`)
    }
}
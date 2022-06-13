module.exports = class fix_connection_price1655129942761 {
  name = 'fix_connection_price1655129942761'

  async up(db) {
    await db.query(`ALTER TABLE "node" ALTER COLUMN "connection_price" DROP NOT NULL`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "node" ALTER COLUMN "connection_price" SET NOT NULL`)
  }
}

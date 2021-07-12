
export default (db) => {

  const createUser = (email, hash) => {
    return db.query(
      'INSERT INTO "user" (email, hash) VALUES ($1, $2) RETURNING "uid"',
      [email.toLowerCase(), hash]
    )
  }

  const findEmail = (email) => {
    return db.query(
      'SELECT "email" FROM "user" WHERE "email" = $1',
      [email.toLowerCase()]
    )
  }

  const findUser = (email) => {
    return db.query(
      'SELECT "uid", "email", "hash" FROM "user" WHERE "email" = $1',
      [email.toLowerCase()]
    )
  }

  const findOne = (uid) => {
    return db.query(
      'SELECT "email" FROM "user" WHERE "uid" = $1',
      [uid]
    )
  }

  const updateHash = (email, hash) => {
    return db.query(
      'UPDATE "user" SET "hash" = $1, "updated_at" = NOW() WHERE "email" = $2',
      [hash, email.toLowerCase()]
    )
  }

  const deleteUser = (uid) => {
    return db.query(
      'DELETE FROM "user" WHERE "uid" = $1',
      [uid]
    )
  }

  return {
    createUser,
    findEmail,
    findUser,
    findOne,
    updateHash,
    deleteUser
  }
}

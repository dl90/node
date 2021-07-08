
export default (db) => {
  const getAll = async () => {
    return await db.query(
      'SELECT * FROM note ORDER BY "id"'
    )
  }

  const getOne = async (id) => {
    return await db.query(
      'SELECT * FROM "note" WHERE "id" = $1',
      [id]
    )
  }

  const createOne = async (title, body) => {
    return await db.query(
      'INSERT INTO "note" (title, body) VALUES ($1, $2) RETURNING *',
      [title, body]
    )
  }

  const updateOne = async (id, title, body) => {
    return await db.query(
      'UPDATE "note" SET "title" = $1, "body" = $2 WHERE "id" = $3 RETURNING *',
      [title, body, id]
    )
  }

  const deleteOne = async (id) => {
    return await db.query(
      'DELETE FROM "note" WHERE "id" = $1',
      [id]
    )
  }

  return {
    getAll,
    getOne,
    createOne,
    updateOne,
    deleteOne
  }
}

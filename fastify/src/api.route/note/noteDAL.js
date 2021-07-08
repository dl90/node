
export default (db) => {
  const getAll = () => {
    return db.query(
      'SELECT * FROM note ORDER BY "id"'
    )
  }

  const getOne = (id) => {
    return db.query(
      'SELECT * FROM "note" WHERE "id" = $1',
      [id]
    )
  }

  const createOne = (title, body) => {
    return db.query(
      'INSERT INTO "note" (title, body) VALUES ($1, $2) RETURNING *',
      [title, body]
    )
  }

  const updateOne = (id, title, body) => {
    const qParams = [id]
    let query

    if (title && body) {
      query = 'UPDATE "note" SET "title" = $2, "body" = $3 WHERE "id" = $1 RETURNING *'
      qParams.push(title, body)
    } else if (title) {
      query = 'UPDATE "note" SET "title" = $2 WHERE "id" = $1 RETURNING *'
      qParams.push(title)
    } else if (body) {
      query = 'UPDATE "note" SET "body" = $2 WHERE "id" = $1 RETURNING *'
      qParams.push(body)
    }

    return db.query(query, qParams)
  }

  const deleteOne = (id) => {
    return db.query(
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

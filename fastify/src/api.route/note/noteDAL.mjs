
export default (db) => {
  const getAll = ({ search, index = 0, limit = 20 }) => {
    let query = 'SELECT "id", "title", "body", "created_at", "updated_at" FROM "note" '
    let qParams

    if (search) {
      query += `WHERE "body_tsv" @@ to_tsquery($1)
        ORDER BY ts_rank_cd("body_tsv", to_tsquery($1)), "updated_at", "created_at"
        LIMIT $2 OFFSET $3`
      qParams = [search, limit, index]
    } else {
      query += 'ORDER BY "updated_at", "created_at" LIMIT $1 OFFSET $2'
      qParams = [limit, index]
    }

    console.log(query)
    return db.query(query, qParams)
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
      query = 'UPDATE "note" SET "title" = $2, "body" = $3, "updated_at" = NOW() WHERE "id" = $1 RETURNING *'
      qParams.push(title, body)
    } else if (title) {
      query = 'UPDATE "note" SET "title" = $2, "updated_at" = NOW() WHERE "id" = $1 RETURNING *'
      qParams.push(title)
    } else if (body) {
      query = 'UPDATE "note" SET "body" = $2, "updated_at" = NOW() WHERE "id" = $1 RETURNING *'
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

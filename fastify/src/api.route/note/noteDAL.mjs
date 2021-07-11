
export default (db) => {
  const getAll = ({ search, index = 0, limit = 20 }) => {
    let query = `SELECT "id", "title", "body", "created_at", "updated_at", "user_uid"
                FROM "note" `
    let qParams

    if (search) {
      query += `WHERE "body_tsv" @@ to_tsquery($1)
        ORDER BY ts_rank_cd("body_tsv", to_tsquery($1)), "updated_at", "created_at", "id"
        LIMIT $2 OFFSET $3`
      qParams = [search, limit, index]
    } else {
      query += 'ORDER BY "updated_at", "created_at", "id" LIMIT $1 OFFSET $2'
      qParams = [limit, index]
    }

    return db.query(query, qParams)
  }

  const getOne = (id) => {
    return db.query(
      'SELECT * FROM "note" WHERE "id" = $1',
      [id]
    )
  }

  const createOne = (uid, title, body) => {
    return db.query(
      'INSERT INTO "note" (user_uid, title, body) VALUES ($1, $2, $3) RETURNING *',
      [uid, title, body]
    )
  }

  const updateOne = (id, uid, title, body) => {
    const qParams = [id, uid]
    let query

    if (title && body) {
      query = `UPDATE "note" SET "title" = $3, "body" = $4, "updated_at" = NOW()
              WHERE "id" = $1 AND "user_uid" = $2 RETURNING *`
      qParams.push(title, body)
    } else if (title) {
      query = `UPDATE "note" SET "title" = $3, "updated_at" = NOW()
              WHERE "id" = $1 AND "user_uid" = $2 RETURNING *`
      qParams.push(title)
    } else if (body) {
      query = `UPDATE "note" SET "body" = $3, "updated_at" = NOW()
              WHERE "id" = $1 AND "user_uid" = $2 RETURNING *`
      qParams.push(body)
    }

    return db.query(query, qParams)
  }

  const deleteOne = (id, uid) => {
    return db.query(
      'DELETE FROM "note" WHERE "id" = $1 AND "user_uid" = $2',
      [id, uid]
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

const TABLE = 'post'

export function getAll (pool) {
  return new Promise((resolve, reject) => {
    pool.getConnection(async (err, connection) => {
      if (err) reject(err)

      connection.query(`SELECT * FROM ${TABLE};`, (error, results, fields) => {
        connection.release()

        if (error) reject(error)
        resolve(results[0])
      })
    })
  })
}

export function insert (pool, payload) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err)

      connection.query(`INSERT INTO ${TABLE} SET ?`, payload, (error, results, fields) => {
        connection.release()

        if (error) reject(error)
        resolve(results)
      })
    })
  })
}

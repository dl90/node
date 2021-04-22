import * as post from '../../../store/posts/queries.js'

export default function controller (pool) {

  this.getAll = async function (req, res) {
    try {
      const posts = await post.getAll(pool)
      res.send(posts)
    }
    catch (error) {
      console.log(error)
      res.status(404)
    }
  }

  this.insert = async function (req, res) {
    try {
      const result = await post.insert(pool, { description: 'test' })
      console.log(result)
    }
    catch (error) {
      console.log(error)
      res.status(404)
    }
  }

}

import express from 'express'
import postController from './postController.js'

const router = express.Router()

export default function (databasePool) {
  const controller = new postController(databasePool)

  router.get('/all', controller.getAll)
  router.post('/', controller.insert)

  return router
}
import tap from 'tap'

import setup from '../../setup.mjs'
import { pgConfig } from '../../../config/appConfig.mjs'

const server = setup()
const route = '/api/note'

tap.test(`Integration: ${route}`, async t => {
  const note = { title: 'test 1', body: 'note 1' }
  const notes = Array.from({ length: 99 }, (_, i) => ({ title: `test ${i + 2}`, body: `note ${i + 2}` }))

  t.before(async () => {
    await server.ready()
    await server.pg[pgConfig.database].query('TRUNCATE "note" RESTART IDENTITY')
  })

  t.teardown(async () => {
    await server.pg[pgConfig.database].query('TRUNCATE "note" RESTART IDENTITY')
    await server.close()
  })


  t.test(`POST ${route} - create note`, async t => {
    const response = await server.inject({
      method: 'POST',
      url: route,
      payload: note
    })
    t.equal(response.statusCode, 201)
    t.equal(response.json().note.title, note.title, 'response title matches')
    t.equal(response.json().note.body, note.body, 'response body matches')

    const noTitle = await server.inject({
      method: 'POST',
      url: route,
      payload: { body: 'note 1' }
    })
    t.equal(noTitle.statusCode, 400, 'missing title returns 400')

    const noBody = await server.inject({
      method: 'POST',
      url: route,
      payload: { title: 'test 1' }
    })
    t.equal(noBody.statusCode, 400, 'missing body returns 400')

    const bulk = notes.map(n => server.inject({
      method: 'POST',
      url: route,
      payload: n
    }))
    await Promise.all(bulk)
  })


  t.test(`GET ${route} - get all notes`, async t => {
    const noQuery = await server.inject({
      method: 'GET',
      url: route
    })
    t.equal(noQuery.statusCode, 200)
    t.equal(noQuery.json().notes.length, 20, 'returns 20 notes by default')

    const limit = await server.inject({
      method: 'GET',
      url: route + '?limit=10'
    })
    t.equal(limit.statusCode, 200)
    t.equal(limit.json().notes.length, 10, 'returns 10 notes')

    const offset = await server.inject({
      method: 'GET',
      url: route + '?index=10&limit=30'
    })
    t.equal(offset.statusCode, 200)
    t.equal(offset.json().notes.length, 30, 'returns 30 notes')
  })


  t.test(`GET ${route}/1 - get note`, async t => {
    const response = await server.inject({
      method: 'GET',
      url: route + '/1'
    })
    t.equal(response.statusCode, 200)
    t.equal(response.json().note.title, note.title, 'same note title')
    t.equal(response.json().note.body, note.body, 'same note body')

    const notExist = await server.inject({
      method: 'GET',
      url: route + '/101'
    })
    t.equal(notExist.statusCode, 404)
  })


  t.test(`PUT ${route} - update a note`, async t => {
    const uNote = { id: 11 }

    uNote.title = 'title 11'
    const justTitle = await server.inject({
      method: 'PUT',
      url: route,
      payload: uNote
    })
    t.equal(justTitle.statusCode, 200)
    t.equal(justTitle.json().note.title, uNote.title)
    delete uNote.title

    uNote.body = 'body 11'
    const justBody = await server.inject({
      method: 'PUT',
      url: route,
      payload: uNote
    })
    t.equal(justBody.statusCode, 200)
    t.equal(justBody.json().note.body, uNote.body)
    delete uNote.body

    uNote.title = 'both 11'
    uNote.body = 'both 11'
    const response = await server.inject({
      method: 'PUT',
      url: route,
      payload: uNote
    })
    t.equal(response.statusCode, 200)
    t.equal(response.json().note.title, uNote.title)
    t.equal(response.json().note.body, uNote.body)

    uNote.id = 101
    const notExist = await server.inject({
      method: 'PUT',
      url: route,
      payload: uNote
    })
    t.equal(notExist.statusCode, 404)
  })


  t.test(`DELETE ${route} - delete a note`, async t => {
    const payload = { id: 1 }

    const response = await server.inject({
      method: 'DELETE',
      url: route,
      payload
    })
    t.equal(response.statusCode, 200)
    t.match(response.json().message, new RegExp(payload.id.toString(), 'gi'))

    const notExist = await server.inject({
      method: 'DELETE',
      url: route,
      payload
    })
    t.equal(notExist.statusCode, 404)

    const notExist1 = await server.inject({
      method: 'GET',
      url: route + '/1'
    })
    t.equal(notExist1.statusCode, 404)
  })
})

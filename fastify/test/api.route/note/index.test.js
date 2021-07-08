import setup from '../../setup.js'

const server = setup()
const route = '/api/note'

describe('Integration: /api/note', () => {
  const note = { title: 'test 1', body: 'note 1' }
  const notes = Array.from({ length: 99 }, (_, i) => ({ title: `test ${i + 2}`, body: `note ${i + 2}` }))

  test('POST /api/note - create note', async () => {
    const response = await server.inject({
      method: 'POST',
      url: route,
      payload: note
    })
    expect(response.statusCode).toEqual(201)
    expect(response.json().note.title).toEqual(note.title)
    expect(response.json().note.body).toEqual(note.body)

    const noTitle = await server.inject({
      method: 'POST',
      url: route,
      payload: { body: 'note 1' }
    })
    expect(noTitle.statusCode).toEqual(400)

    const noBody = await server.inject({
      method: 'POST',
      url: route,
      payload: { title: 'test 1' }
    })
    expect(noBody.statusCode).toEqual(400)
  })


  test('GET /api/note - get all notes', async () => {
    const bulk = notes.map(n => server.inject({
      method: 'POST',
      url: route,
      payload: n
    }))

    await Promise.all(bulk)
    const response = await server.inject({
      method: 'GET',
      url: route
    })
    expect(response.statusCode).toEqual(200)
    expect(response.json().notes.length).toEqual(100)
  })


  test('GET /api/note/1 - get note', async () => {
    const response = await server.inject({
      method: 'GET',
      url: route + '/1'
    })
    expect(response.statusCode).toEqual(200)
    expect(response.json().note.title).toEqual(note.title)
    expect(response.json().note.body).toEqual(note.body)

    const notExist = await server.inject({
      method: 'GET',
      url: route + '/101'
    })
    expect(notExist.statusCode).toEqual(404)
  })


  test('PUT /api/note - update a note', async () => {
    const uNote = { id: 11 }

    uNote.title = 'title 11'
    const justTitle = await server.inject({
      method: 'PUT',
      url: route,
      payload: uNote
    })
    expect(justTitle.statusCode).toEqual(200)
    expect(justTitle.json().note.title).toEqual(uNote.title)
    delete uNote.title

    uNote.body = 'body 11'
    const justBody = await server.inject({
      method: 'PUT',
      url: route,
      payload: uNote
    })
    expect(justBody.statusCode).toEqual(200)
    expect(justBody.json().note.body).toEqual(uNote.body)
    delete uNote.body

    uNote.title = 'both 11'
    uNote.body = 'both 11'
    const response = await server.inject({
      method: 'PUT',
      url: route,
      payload: uNote
    })
    expect(response.statusCode).toEqual(200)
    expect(response.json().note.title).toEqual(uNote.title)
    expect(response.json().note.body).toEqual(uNote.body)

    uNote.id = 101
    const notExist = await server.inject({
      method: 'PUT',
      url: route,
      payload: uNote
    })
    expect(notExist.statusCode).toEqual(404)
  })


  test('DELETE /api/note - delete a note', async () => {
    const payload = { id: 1 }

    const response = await server.inject({
      method: 'DELETE',
      url: route,
      payload
    })
    expect(response.statusCode).toEqual(200)
    expect(response.json().message).toContain(payload.id.toString())

    const notExist = await server.inject({
      method: 'DELETE',
      url: route,
      payload
    })
    expect(notExist.statusCode).toEqual(404)

    const notExist1 = await server.inject({
      method: 'GET',
      url: route + '/1'
    })
    expect(notExist1.statusCode).toEqual(404)
  })
})

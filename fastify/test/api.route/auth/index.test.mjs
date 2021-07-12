import { test } from 'tap'

import setup from '../../setup.mjs'
import { sessionConfig } from '../../../config/appConfig.mjs'

const route = '/api/auth'

test(`Integration: ${route}`, async t => {
  const server = setup()
  const user = { email: `test@${Math.random()}.com`, password: 'Test@1234' }
  const session = {}

  t.before(async () => {
    await server.ready()
    // await server.pg[pgConfig.database].query('DELETE FROM "user"')
  })

  t.teardown(async () => {
    // await server.pg[pgConfig.database].query('DELETE FROM "user"')

    const deleteUser = await server.inject({
      method: 'DELETE',
      url: '/api/auth/',
      cookies: session.cookie
    })
    console.log('test user deletion: ', deleteUser.json())

    server.close()
    process.exit(0)
  })

  t.test(`POST ${route}/signup - create user`, async t => {

    const badPW = await server.inject({
      method: 'POST',
      url: route + '/login',
      payload: { email: 'test@test.com', password: '123456' }
    })
    t.equal(badPW.statusCode, 422)

    const signup = await server.inject({
      method: 'POST',
      url: route + '/signup',
      payload: user
    })

    console.log('test user creation: ', signup.json())
    session.cookie = {
      [signup.cookies[0].name]: signup.cookies[0].value,
    }
    console.log(session.cookie)

    t.equal(signup.statusCode, 201)
    t.equal(signup.json().username, user.username)

    const again = await server.inject({
      method: 'POST',
      url: route + '/signup',
      payload: user
    })
    t.equal(again.statusCode, 400)
  })


  t.test(`POST ${route}/login - login user`, async t => {
    const wrongPW = await server.inject({
      method: 'POST',
      url: route + '/login',
      payload: { email: user.email, password: 'Test@4321' }
    })
    t.equal(wrongPW.statusCode, 400)

    const login = await server.inject({
      method: 'POST',
      url: route + '/login',
      payload: user
    })
    t.equal(login.statusCode, 200)
    t.equal(login.cookies[0].name, sessionConfig.name)

    const check = await server.inject({
      method: 'GET',
      url: route,
      cookies: session.cookie
    })
    t.equal(check.statusCode, 200)
    t.equal(check.json().user.email, user.email)
  })

})

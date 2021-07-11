import tap from 'tap'

import setup from '../../setup.mjs'
import { pgConfig } from '../../../config/appConfig.mjs'

const server = setup()
const route = '/api/auth'

tap.test(`Integration: ${route}`, async t => {
  const user = { email: 'test@test.com', password: 'Test@123' }

  t.before(async () => {
    await server.ready()
    await server.pg[pgConfig.database].query('TRUNCATE "user"')
  })

  t.teardown(async () => {
    await server.pg[pgConfig.database].query('TRUNCATE "user"')
    await server.close()
  })


  t.test(`POST ${route}/signup - create user`, async t => {
    const fail = await server.inject({
      method: 'POST',
      url: route + '/login',
      payload: { email: 'test@test.com', password: '123456' }
    })
    t.equal(fail.statusCode, 400)

    const signup = await server.inject({
      method: 'POST',
      url: route + '/signup',
      payload: user
    })
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
    const fail = await server.inject({
      method: 'POST',
      url: route + '/login',
      payload: { email: 'test@test.com', password: 'Test@121' }
    })
    t.equal(fail.statusCode, 400)

    const login = await server.inject({
      method: 'POST',
      url: route + '/login',
      payload: user
    })
    t.equal(login.statusCode, 200)
    const session = login.headers['set-cookie']

    const check = await server.inject({
      method: 'GET',
      url: route,
      headers: { cookie: session }
    })
    t.equal(check.statusCode, 200)
    t.equal(check.json().user.email, user.email)
  })

})

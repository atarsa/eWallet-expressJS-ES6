const app = require('../server');
const supertest = require('supertest');
const request = supertest(app);
const mongoose = require('mongoose')
const databaseName = 'auth-test'
const Wallet = require('../model/Wallet')


beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`
  await mongoose.connect(url, { useNewUrlParser: true })
})

it('Should save user to database', async () => {
  const res = await request.post('/api/user/register')
	                        .send({
                                  username: 'aga123',
                                  password: 'secretPassword'
                                })
  
  // Searches the user in the database
  const wallet = await Wallet.findOne({ username: 'aga123' })
  expect(wallet.username).toBeTruthy()
  expect(wallet.password).toBeTruthy()
  expect(res.statusCode).toBe(200)
  expect(res.text).toBe('Success! User registered.')
})

it('Should not save user to database as already registered', async () => {
  const res = await request.post('/api/user/register')
	                        .send({
                                  username: 'aga123',
                                  password: 'secretPassword'
                                })
 
  expect(res.statusCode).toBe(400)
  
})

it('Should log in already registered user ', async () => {
  const res = await request.post('/api/user/login')
	                        .send({
                                  username: 'aga123',
                                  password: 'secretPassword'
                                })
 
  expect(res.statusCode).toBe(200)
  
})

it('Should not login registered user with wrong password', async () => {
  const res = await request.post('/api/user/login')
	                        .send({
                                  username: 'aga123',
                                  password: 'password'
                                })
 
  expect(res.statusCode).toBe(400)
  expect(res.text).toBe('Invalid password')
  
})
it('Should not log in unregistered user ', async () => {
  const res = await request.post('/api/user/login')
	                        .send({
                                  username: 'rad123',
                                  password: 'secretPassword'
                                })
 
  expect(res.statusCode).toBe(400)
  expect(res.text).toBe('Username not found')
  
})

afterAll(async () => {
  await Wallet.deleteMany()
 
})
const app = require('../server');
const supertest = require('supertest');
const request = supertest(app);

it('Gets the rates/latest endpoint with base currency in query', async () =>{
  
  // Send GET request to to rates/latest endpoint
  const res = await request
                      .get('/api/rates/latest')
                      .query('base=GBP')

  expect(res.statusCode).toBe(200)
  
})

it('Gets the rates/latest endpoint without base currency in query', async () =>{
  
  // Send GET request to to rates/latest endpoint
  const res = await request
                      .get('/api/rates/latest')
                      
  expect(res.statusCode).toBe(404)
  expect(res.text).toBe('Something went wrong. Check your query for mistakes.')

})

it('Gets the rates/latest endpoint with base currency and symbols in query', async () =>{
  
  // Send GET request to to rates/latest endpoint
  const res = await request
                      .get('/api/rates/latest')
                      .query('base=GBP&symbols=USD,PLN,EUR')

  expect(res.statusCode).toBe(200)
  
})

it('Post foreign currency to "exchange money"', async () =>{
  
  // Send POST request to to rates/exchange endpoint
  const res = await request
                      .post('/api/rates/exchange')
                      .send({
                        "baseCurrency": "GBP",
                        "exchangeCurrency": "PLN",
                        "amount": 200
                      })
                      .set('Accept', 'application/json')

  expect(res.statusCode).toBe(200)    
})
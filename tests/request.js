const Request = require('./../lib/request')
const uuid = require('uuid')
let request = new Request({
  channel_id: '111111',
  key: '04778123a8649621848c4eb197b92234'
})

describe('request', () => {

  it('demo', async () => {
    request.post('http://127.0.0.1:8000/pub/demo/func', {
      a: 'a',
      b: 'b'
    }, {
      uuid: uuid.v4(),
      timestamp: Date.now()
    }).then(console.log)
  })
})
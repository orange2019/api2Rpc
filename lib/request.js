const request = require('request')
const md5 = require('md5')

class Request {

  constructor(opt) {
    this.channel_id = opt.channel_id
    this.key = opt.key
  }

  post(url, data, headers = {}, type = 'json') {
    headers.channel_id = this.channel_id
    headers.timestamp = headers.timestamp || Date.now()
    headers['Content-Type'] = 'application/json'
    if (type === 'form') {
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    data.sign = this._getSignature(data, headers)

    let options = {
      url: url,
      method: 'POST',
      headers: headers,
      body: data,
      json: type === 'json' ? true : false
    }

    return new Promise((r, j) => {
      request(options, function (error, response, body) {
        if (error) {
          // throw new Error(error);
          r({
            code: -1,
            message: error.message || 'request error'
          })
        }

        // console.log('request body:', typeof body, body);
        r(body)

      });
    })
  }

  /**
   * 签名字段
   * @param {*} data 
   * @param {*} headers 
   */
  _getSignature(data, headers) {
    data.timestamp = headers.timestamp
    data.key = this.key
    // console.log(data)
    let signStrArr = []
    Object.keys(data).sort().forEach(key => {
      if (key != 'sign' && typeof key !== 'array' && typeof key !== 'object') {
        signStrArr.push(`${key}=${data[key]}`)
      }
    })
    let signStr = signStrArr.join('&')
    // console.log(signStr)
    let signMd5 = md5(signStr)
    // console.log(signMd5)
    return signMd5
  }
}

module.exports = Request
const express = require('express')
const app = express()
const jayson = require('jayson')
const CONFIG = require('./config')

var bodyParser = require('body-parser')
var methodOverride = require('method-override')

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(bodyParser.raw({
  type: 'application/xml'
}))
app.use(bodyParser.text({
  type: 'text/xml'
}))
app.use(methodOverride())

app.get('/timestamp', (req, res) => {
  return res.send(Date.now().toString())
})
/**
 * 鉴权
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const apiAuthCheck = async (req, res, next) => {
  // TODO
  next()
}
app.use(apiAuthCheck)

// rpc客户端请求
const rpcClient = jayson.client
let rpcRequest = (client, func, args) => {
  return new Promise((r, j) => {
    client.request(func, args, (err, response) => {
      if (err) {
        console.error(err.message || err)
        r({
          code: -1,
          message: err.message || err
        })
      }

      console.log(response.result) // 2
      r(response.result)
    });
  })
}

// 处理rpc分发逻辑
app.post('/:mod/:con/:func', async (req, res) => {

  let mod = req.params.mod
  let con = req.params.con
  let func = req.params.func

  let ret = {
    code: 0,
    message: 'success'
  }

  if (!CONFIG.rpcClients.hasOwnProperty(mod)) {
    ret.code = 1
    ret.message = 'error module'
    return res.json(ret)
  }

  let clientConfig = CONFIG.rpcClients[mod]
  let client = rpcClient.http({
    host: clientConfig.host,
    port: clientConfig.port
  })

  let rpcFunc = con + '_' + func
  let rpcArgs = req.body || {}
  rpcArgs.uuid = req.headers.uuid || '123456'

  rpcRet = await rpcRequest(client, rpcFunc, rpcArgs)
  // console.log(rpcRet)
  return res.json(rpcRet)
})

// 错误处理
const logErrors = (err, req, res, next) => {
  console.error(err.stack)
  next(err)
}

const clientErrorHandler = (err, req, res, next) => {
  if (req.xhr) {
    return res.status(500).json({
      code: -1,
      message: '500 error'
    })
  } else {
    next(err)
  }
}

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  return res.send('500 error')
}

app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

app.listen(CONFIG.port, () => {
  console.log('api server start at port: ', CONFIG.port)
})
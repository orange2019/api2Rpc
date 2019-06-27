const fs = require('fs')
const path = require('path')
const env = process.env.NODE_ENV

let config = {
  port: 8000,
  // rpc客户端配置
  rpcClients: {
    pub: {
      host: '127.0.0.1',
      port: 10001
    }
  },
  // api请求渠道配置
  channels: [{
    id: '111111',
    key: '04778123a8649621848c4eb197b92234'
  }]
}

if (fs.existsSync(path.join(__dirname, './' + env + '.js'))) {

  let envConfig = require('./' + env)
  console.log('load config env:', env)
  if (envConfig) {
    config = Object.assign(config, envConfig)
  }
}



module.exports = config
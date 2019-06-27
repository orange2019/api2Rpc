const fs = require('fs')
const path = require('path')
const env = process.env.NODE_ENV

let config = {
  port: 8000,
  rpcClients: {
    pub: {
      host: '127.0.0.1',
      port: 10001
    }
  }
}

if (fs.existsSync(path.join(__dirname, './' + env + '.js'))) {

  let envConfig = require('./' + env)
  console.log('load config env:', env)
  if (envConfig) {
    config = Object.assign(config, envConfig)
  }
}



module.exports = config
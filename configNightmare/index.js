var proxyRotation = require('../proxyrotation')

module.exports = function (Nightmare) {
  var proxy = proxyRotation.randomProxy()
  console.log(proxy)
  var nightmare = new Nightmare(
    {
      show: false,
      maxAuthRetries: 10,
      waitTimeout: 100000,
      electronPath: require('electron'),
      Promise: require('bluebird'),
      switches: {
        'ignore-certificate-errors': true,
        'proxy-server': proxy.addr + ':' + proxy.port
      },
      webPreferences: {
        webSecurity: false
      }
    })
  return nightmare.useragent(proxyRotation.genUseragent()).authentication(proxy.user, proxy.pass)
}

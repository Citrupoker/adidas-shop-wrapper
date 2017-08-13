var proxyRotation = require('../proxyrotation')

module.exports = function (Nightmare) {
  var proxy = proxyRotation.randomProxy()
  console.log(proxy)
  if (proxy) {
    var nightmare = new Nightmare(
      {
        show: false,
        maxAuthRetries: 10,
        waitTimeout: 100000,
        electronPath: require('electron'),
        switches: {
          'ignore-certificate-errors': true,
          'proxy-server': proxy.addr + ':' + proxy.port
        },
        webPreferences: {
          webSecurity: false
        }
      })
    return nightmare.useragent(proxyRotation.genUseragent()).authentication(proxy.user || '', proxy.pass || '')
  } else {
    var nightmare1 = new Nightmare(
      {
        show: false,
        maxAuthRetries: 10,
        waitTimeout: 100000,
        electronPath: require('electron'),
        switches: {
          'ignore-certificate-errors': true
        },
        webPreferences: {
          webSecurity: false
        }
      })
    return nightmare1.useragent(proxyRotation.genUseragent())
  }
}

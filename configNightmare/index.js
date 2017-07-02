var proxyRotation = require('../proxyrotation')

module.exports = function (Nightmare) {
  var proxy = proxyRotation.getProxy()
  var nightmare = new Nightmare(
    {
      show: false,
      maxAuthRetries: 10,
      waitTimeout: 100000,
      electronPath: require('electron'),
      switches: {
        'ignore-certificate-errors': true,
        'proxy-server': proxy.addr
      },
      webPreferences: {
        webSecurity: false
      }
    })
  return nightmare.useragent(proxy.genUseragent()).authentication(proxy.user, proxy.password)
}

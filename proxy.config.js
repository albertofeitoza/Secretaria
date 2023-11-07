const PROXY_CONFIG = [
    {
      context: '/api',
      target: 'http://192.168.15.200:5000',
      secure : false,
      logLevel : 'debug',
    }
  ];
  module.exports = PROXY_CONFIG;

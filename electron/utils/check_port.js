const net = require('net');
const EventEmitter = require('events').EventEmitter;

class PortCheck extends EventEmitter {
  constructor(option) {
    super();
    this.timeout = option.timeout || 3000;
    this.getBanner =
      option.getBanner == null ? false : parseInt(option.getBanner) || 512;
  }
  check(ip, port) {
    let result = {};
    let startConnectTime = Date.now();
    let socket = net
      .createConnection(Number(port), ip)
      .removeAllListeners('timeout')
      .setTimeout(this.timeout);
    socket
      .once('close', () => {
        this.emit('done', ip, port, result);
      })
      .on('error', err => {
        console.warn(err);
      })
      .once('connect', () => {
        result.connectTime = Date.now() - startConnectTime;
        result.opened = true;
        if (!this.getBanner) {
          PortCheck.socketDestroy(socket);
        }
      })
      .on('timeout', () => {
        if (!result.opened) {
          result = {
            status: 'timeout',
            opened: false
          };
        } else {
          result.status = 'open';
        }
        socket.destroy();
      })
      .on('data', chunk => {
        if (!this.getBanner) {
          PortCheck.socketDestroy(socket);
          return;
        }
        let data = chunk
          .toString()
          .split('\0')
          .shift();
        if (data) {
          result.banner = data
            .replace(/[\r\n]/g, ' ')
            .trim()
            .substring(0, this.getBanner);
        }
      });
    return this;
  }
  static socketDestroy(socket) {
    socket.destroySoon();
  }
}

module.exports = PortCheck;

/**
 * @usage
 * 
let checker = new PortCheck({
    timeout: 1000,
    getBanner: 512
})

checker
    .check(IP_ADDRESS, 40112)
    .check(IP_ADDRESS, 40123)
    .check(IP_ADDRESS, 3282)
    .check(IP_ADDRESS, 3287)
    .on('done', (ip, port, result) => {
        console.log(ip, port, result)
    });
 */

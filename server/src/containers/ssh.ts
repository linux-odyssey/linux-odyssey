import { Client } from 'ssh2'
import { Duplex } from 'stream'
import config from '../config.js'

export async function connectToSSH(
  containerIp: string,
  { token }: { token: string }
): Promise<Duplex> {
  const conn = new Client()

  return new Promise((resolve, reject) => {
    conn
      .on('ready', () => {
        console.log('SSH connection ready')
        conn.shell(
          {
            env: {
              TOKEN: token,
              API_ENDPOINT: config.backendUrl,
              ZDOTDIR: '/etc/zsh',
              NODE_PATH: '/usr/src/node_modules',
            },
          },
          (err, stream) => {
            if (err) {
              reject(err)
            }
            stream.on('close', () => {
              console.log('Stream :: close')
              conn.end()
            })
            resolve(stream)
          }
        )
      })
      .on('error', (err) => {
        reject(err)
      })
      .connect({
        host: containerIp,
        port: 22,
        username: 'commander',
        privateKey: config.docker.keypair.privateKey,
        debug: console.log,
        timeout: 5000,
      })
  })
}

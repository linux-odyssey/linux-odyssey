import winston, { format } from 'winston'
import config from '../config.js'

const logger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp(),
    format.json()
  ),
  defaultMeta: { service: 'backend', timestamp: new Date().toISOString() },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({
      dirname: config.log.path,
      filename: 'error.log',
      level: 'error',
    }),
    new winston.transports.File({
      dirname: config.log.path,
      filename: 'combined.log',
    }),
  ],
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  )
}

export default logger

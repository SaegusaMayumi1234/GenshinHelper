import chalk from 'chalk';
import winston from 'winston';
import { SPLAT } from 'triple-beam';
import 'winston-daily-rotate-file';

const monthToNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};
const longestStr = Math.max(...Object.keys(levels).map((key) => key.length));
const fileTransports = {};
let currentDirName = null;

function colorizeLevel(level) {
  let res = level;
  switch (level) {
    case 'error':
      res = chalk.red(level);
      break;
    case 'warn':
      res = chalk.yellow(level);
      break;
    case 'info':
      res = chalk.green(level);
      break;
    case 'http':
      res = chalk.magenta(level);
      break;
    case 'debug':
      res = chalk.cyan(level);
      break;
    default:
      break;
  }
  return res;
}

function getFormat() {
  return winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.printf((info) => {
      // Creating custom console log because winston console transport cannot do this
      if (info.level === 'error') {
        console.error(
          info.timestamp,
          `${colorizeLevel(info.level)}:${' '.repeat(longestStr - info.level.length)}`,
          ...(Array.isArray(info[SPLAT]) ? info[SPLAT] : []),
        );
      } else {
        console.log(
          info.timestamp,
          `${colorizeLevel(info.level)}:${' '.repeat(longestStr - info.level.length)}`,
          ...(Array.isArray(info[SPLAT]) ? info[SPLAT] : []),
        );
      }
      return `${info.timestamp} ${info.level}:${' '.repeat(longestStr - info.level.length)} ${info.message}`;
    }),
  );
}

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'http',
  levels,
  format: getFormat(),
});

function updateTransport(dirname, type, level) {
  const newTransport = new winston.transports.DailyRotateFile({
    dirname: `logs/${dirname}`,
    filename: `%DATE%-log-${type}`,
    datePattern: 'YYYY-MM-DD',
    level: level,
    extension: '.log',
    utc: true,
  });

  if (fileTransports[type]) {
    logger.remove(fileTransports[type]);
    fileTransports[type].close();
  }

  logger.add(newTransport);
  fileTransports[type] = newTransport;
}

function checkTransport() {
  const currDate = new Date();
  const dirname = `${currDate.getUTCFullYear()}/${('0' + (currDate.getUTCMonth() + 1)).slice(-2)}-${monthToNames[currDate.getUTCMonth()]}`;

  if (currentDirName !== dirname) {
    updateTransport(dirname, 'all', 'debug');
    updateTransport(dirname, 'error', 'error');
  }

  currentDirName = dirname;
}

function formatLog(data) {
  return data.map((value) => (value instanceof Error ? value.stack : value)).join(' ');
}

// spreading data so it will be used as splat for raw data to use with console.log
/**
 * Logging utility that provides methods for various logging levels.
 */
export default {
  /**
   * Logs an error-level message.
   * @param {...any} data - The data to log.
   */
  error: (...data) => {
    checkTransport();
    logger.error(formatLog(data), ...data);
  },

  /**
   * Logs a warning-level message.
   * @param {...any} data - The data to log.
   */
  warn: (...data) => {
    checkTransport();
    logger.warn(formatLog(data), ...data);
  },

  /**
   * Logs an info-level message.
   * @param {...any} data - The data to log.
   */
  info: (...data) => {
    checkTransport();
    logger.info(formatLog(data), ...data);
  },

  /**
   * Logs an HTTP-level message.
   * @param {...any} data - The data to log.
   */
  http: (...data) => {
    checkTransport();
    logger.http(formatLog(data), ...data);
  },

  /**
   * Logs a debug-level message.
   * @param {...any} data - The data to log.
   */
  debug: (...data) => {
    checkTransport();
    logger.debug(formatLog(data), ...data);
  },
};

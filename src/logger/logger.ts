import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const mydate = new Date();
const newFilename = mydate.getFullYear() + "-" + mydate.getMonth() + "-" + mydate.getDate() + "-" + "xxx.log";

const transport: DailyRotateFile = new DailyRotateFile({
    filename: 'application-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});

transport.on('rotate', function (oldFilename, newFilename) {
    // do something fun
});

const logConfiguration = {
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'logs/' + newFilename,
        }),
        transport
    ],
    format: winston.format.combine(
        winston.format.label({
            label: `app`
        }),
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf((info: any) => `[${info.level}] [${info.label}] [${[info.timestamp]}] ${info.message}`),
    )
};

const logger = winston.createLogger(logConfiguration);

export default logger;

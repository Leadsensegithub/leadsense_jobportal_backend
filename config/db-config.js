require('dotenv').config()
var moment = require('moment');

const config = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    typeCast: function (field, next) {
        if (field.type == 'DATETIME' || field.type == 'TIMESTAMP') {
            return moment(field.string()).format('DD-MM-YYYY HH:mm:ss');
        }
        if (field.type == 'DATE') {
          return moment(field.string()).format('DD-MM-YYYY');
        }
        return next();
    }
  },
  pool: {
    min: Number(process.env.DB_POOL_MIN),
    max: Number(process.env.DB_POOL_MAX)
  },
  acquireConnectionTimeout: Number(process.env.DB_TIMEOUT)
}
module.exports = config;
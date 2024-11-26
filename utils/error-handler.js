const Localize = require('localize')
const error = require('./../utils/error-msg')
const paramsErrorMsg = new Localize(error.PARAM_ERROR)
const ctrlErrorMsg = new Localize(error.ERROR)
const ctrlSuccessMsg = new Localize(error.SUCCESS)

module.exports.requestHandler = (error, status, callback) => {
  const message = {}
  try {
    paramsErrorMsg.setLocale('default')
    message.status = 400
    message.error = status
    let messageData = {};
    error.forEach((row, index, array) => {
      var multiMsg = row.msg.split(',');
      var errMsg = paramsErrorMsg.translate(multiMsg[0], multiMsg[1], multiMsg[2], multiMsg[3]);
      messageData[row.param] = errMsg;
    });
    message.message = messageData;
  } catch (err) {
    message.status = 403
    message.error = true
    message.message = 'Oops something went wrong'
  }
  callback(message)
}

module.exports.ctrlHandler = (data, callback) => {
  const message = {}
  const errorMessage = data.msg
  const msg = errorMessage.split(',')
  if (data.error === true) {
    try {
      ctrlErrorMsg.setLocale('default')
      message.status = (data.status) ? data.status : 200;
      message.error = data.error
      message.message = ctrlErrorMsg.translate(msg[0], msg[1], msg[2], msg[3])
      message.data = data.data
    } catch (err) {
      console.log(err)
      message.status = (data.status) ? data.status : 400;
      message.error = data.error
      message.message = 'Oops something went wrong'
    }
  } else {
    try {
      ctrlSuccessMsg.setLocale('default')
      message.status = (data.status) ? data.status : 200;
      message.error = data.error
      message.message = ctrlSuccessMsg.translate(msg[0], msg[1], msg[2], msg[3])
      message.data = data.data
    } catch (err) {
      message.status = (data.status) ? data.status : 403;
      message.error = data.error
      message.message = 'Oops something went wrong'
    }
  }
  callback(message)
}

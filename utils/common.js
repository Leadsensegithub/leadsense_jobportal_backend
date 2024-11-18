require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const moment = require('moment')
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const crypto = require('crypto').webcrypto;

module.exports.sendMail = async ( { filePath, toEmail, subject, data } ) => {
  try{
    const transporter = nodemailer.createTransport({
      port: process.env.SMTP_PORT,              
      host: process.env.SMTP_HOST,
      auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
          },
      secure: true,
    });
    fs.readFile( filePath, 'utf8', function (err, htmlPage) {
      if (err) {
        console.log(err);
        return false
      }
      var mailOptions = {
          from: process.env.SMTP_FROM_EMAIL,
          to: toEmail,
          subject: subject,
          html: ejs.render(htmlPage, data)
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if(err){
          console.log(err)
          return false;
        }else{
          console.log(info)
          return info;
        }
      });
    });
  }catch(err){
    console.log(err)
    return false;
  }
}
module.exports.randomString = (length=6) => {
  try{
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let password = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
        password += chars[array[i] % chars.length];
    }
    return password;
  }catch(err){
    console.log(err)
    return false;
  }
}
module.exports.statusCode = (result={}) => {
  try{
    return (result.status) ? result.status : 403;
  }catch(err){
    console.log(err)
    return 404;
  }
}
module.exports._sortArray = ( arr = [] ) => {
  try{
    return arr.filter( (name,index) => arr.lastIndexOf(name) === index).sort( (a,b) => (a < b ?-1:1) );
  }catch(err){
    console.log(err)
    return false;
  }
}

module.exports._emptyArray = ( arr = []) => {
  try{
    const check = Array.isArray(arr) && ( arr.length === 0 ) ? true : false;
    return check;
  }catch(err){
    console.log(err)
    return false;
  }
}

module.exports._emptyObject = ( obj = {}) => {
  try{
    return (typeof obj === "object" && !Array.isArray(obj) && obj !== null) && (Object.keys(obj).length === 0)? true : false;
  }catch(err){
    console.log(err)
    return false;
  }
}

module.exports._isObject = (obj = {}) => {
  try{
    return (typeof obj === "object" && !Array.isArray(obj) && obj !== null);
  }catch(err){
    console.log(err)
    return false;
  }
}

module.exports._isArray = (arr = []) => {
  try{
    return (typeof arr === "object" && Array.isArray(arr) && arr !== null);
  }catch(err){
    console.log(err)
    return false;
  }
}

module.exports._isInt = (num) => {
  try{
    return num && !isNaN(num) && (function(x) { return (x | 0) === x; })(parseInt(num));
  }catch(err){
    console.log(err)
    return false;
  }
}

module.exports._isStr = (str) => {
  try{
    return (typeof str === "string")?true:false;
  }catch(err){
    console.log(err)
    return false;
  }
}

module.exports.postData = ( req, removeData=[], appendData={} ) => {
  try{
    let inputBody = req.body;
    if(removeData.length != 0){
      removeData.map((row) => {return delete inputBody[row]; });
    }
    const inputArr = {...inputBody,...appendData};
    return inputArr;
  }catch(err){
    console.log(err)
    return false;
  }
}

module.exports.fileImageValidation = (reqFile) => {
  try{
    // Array of allowed files
    const allowedFileTypes = ['png', 'jpeg', 'jpg', 'gif', 'svg'];
    const allowedFileMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml'];
    // Allowed file size in mb
    const fileSize = 2;
    // Get the extension of the uploaded file
    const file_extension = reqFile.name.slice(
        ((reqFile.name.lastIndexOf('.') - 1) >>> 0) + 2
    );

    // Check if the uploaded file is allowed
    if (!allowedFileTypes.includes(file_extension) || !allowedFileMimeTypes.includes(reqFile.mimetype)) {
        return { error:true, status:true, errMsg:'invalid' };
    }

    if ((reqFile.size / (1024 * 1024)) > fileSize) {                  
        return { error:true, status:true, errMsg:'large' };
    }
    return { error:false, status:false, errMsg:'success' };
  }catch(err){
    return { error:true, status:true, errMsg:err };
  }
},

module.exports.filesUploadLocal = (req, fileName = '', pathDirectory = '', type = 'single') => {

  // const strMain = pathDirectory;
  

  try {
    fileName = (type && type == 'single') ? req.files[fileName] : fileName;
    console.log(fileName)
    let file_extension = path.extname(fileName.name);
    console.log(file_extension)
    let current_time = moment().format("DDMMYYYYHHmmss")
    let file_name = current_time + file_extension;
    uploadPath = pathDirectory + '/' + file_name;
    console.log(uploadPath)
    fileName.mv(uploadPath, function (err) {
      if (err) {
        return { error: true, status: true, errMsg: err };
      }
    });
    return { error: false, status: false, uploadPath: uploadPath, file_name: file_name };
  } catch (err) {
    return { error: true, status: true, errMsg: err };
  }
},
module.exports.dateToDbFormat = (date, type='DM') =>{   //DM - Day Month
  try {
    if(date){
      if(type && type === 'DM'){
        const dateArr = date.split(/[/ -]+/);
        var temp = dateArr[1];
        dateArr[1] = dateArr[0];
        dateArr[0] = temp;
        date = dateArr.join('-')
      }
      const newDate = new Date(date);
      return moment(newDate).format('YYYY-MM-DD');
    }else{
      return false;
    }
  }catch(err){
    return false;
  }
}

module.exports.dateTimeToDbFormat = (date, type='DM') =>{   //DM - Day Month
  try {
    if(date){
      if(type && type === 'DM'){
        const dateArr = date.split(/[/ -]+/);
        var temp = dateArr[1];
        dateArr[1] = dateArr[0];
        dateArr[0] = temp;
        date = dateArr.join('-')
      }
      const newDate = new Date(date);
      return moment(newDate).format('YYYY-MM-DD HH:mm:ss');
    }else{
      return false;
    }
  }catch(err){
    return false;
  }
}

module.exports.currentDateTimeDbFormat = (type='datetime') =>{   //DM - Day Month
  try {
    if(type === 'date'){
      return moment().format("YYYY-MM-DD")
    }
    if(type === 'time'){
      return moment().format("MM ddd, YYYY HH:mm:ss a")
    }
    if(type === 'datetime'){
      return moment().format("YYYY-MM-DD HH:mm:ss")
    }
    if(type === 'day'){
      return moment().format("MM ddd, YYYY HH:mm:ss a")
    }
    if(type === 'month'){
      return moment().format("MM")
    }
    if(type === 'year'){
      return moment().format("YYYY")
    }
  }catch(err){
    return false;
    // moment().format();                                // "2019-08-12T17:52:17-05:00" (ISO 8601, no fractional seconds)
    // moment().format("dddd, MMMM Do YYYY, h:mm:ss a"); // "Monday, August 12th 2019, 5:52:00 pm"
    // moment().format("ddd, hA");                       // "Mon, 5PM"
  }
}

module.exports.generateUniqueString = function (length, type) {
  const response = {}
  try {
    let result = ''
    let chars
    if (type === 'numeric') {
      chars = '0123456789'
    } else {
      chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    }
    for (let i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))]
    response.error = false
    response.data = result
    return response
  } catch (err) {
    response.error = true
    return response
  }
}

module.exports.hashPassword = function (password, salt) {
  const response = {}
  return new Promise(function (resolve) {
    bcrypt.hash(password, parseInt(salt), function (err, hash) {
      if (err) {
        response.error = true
      } else {
        response.error = false
        response.data = hash
      }
      resolve(response)
    })
  })
}

module.exports.comparePassword = function (password, hash) {
  return new Promise(function (resolve) {
    bcrypt.compare(password, hash, function (err, result) {
      const response = {}
      if (err) {
        response.error = true
      } else {
        if (result) {
          response.error = false
        } else {
          response.error = true
        }
      }
      resolve(response)
    })
  })
}

module.exports.generateToken = function (data) {
  return new Promise(function (resolve) {
    jwt.sign(data, process.env.TOKEN_SECRET_KEY, { expiresIn: '168h' }, (err, token) => {
      const response = {}
      if (err) {
        response.error = true
      } else {
        response.error = false
        response.data = token
      }
      resolve(response)
    })
  })
}
module.exports.checkInteger = (value) => {
  var x;
  if (isNaN(value)) {
    return (false);
  }
  x = parseFloat(value);
  return (x | 0) === x;
}
module.exports.verifyAuthToken = (req, res, next) => {
  const token = req.body.authtoken || req.query.authtoken || req.headers["authtoken"];
  if (!token) {
      return res.status(403).json({status: 403, message:"A token is required for authentication"});
  }
  try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
      req.user = decoded;
      console.log(decoded)
  } catch (err) {
      return res.status(401).json({status: 403, message:"Invalid Token"});
  }
  return next();
};

module.exports.generateUUID = function () {
  const uuid = uuidv4()
  return uuid
}

module.exports.fileUpload = (image, type) => {
  const response = {}
  const s3Bucket = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION,
    signatureVersion: 'v4',
    apiVersion: '2006-03-01'
  })
  const buf = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  const data = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: this.generateUUID(),
    Body: buf,
    ACL: 'public-read',
    ContentEncoding: 'base64',
    ContentType: type
  }
  return new Promise(function (resolve) {
    s3Bucket.upload(data)
      .promise()
      .then(result => {
        response.error = false
        response.data = { location: result.Location }
        resolve(response)
      }).catch((err) => {
        console.error(err)
        response.error = true
        response.data = err
        resolve(response)
      })
  })
}

module.exports.fileUploadMultiPart = (buffer, originalname, encoding, mimetype) => {
  const response = {}
  const s3Bucket = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION,
    signatureVersion: 'v4',
    apiVersion: '2006-03-01'
  })
  const data = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: originalname,
    Body: buffer,
    ACL: 'public-read',
    ContentEncoding: encoding,
    ContentType: mimetype
  }
  return new Promise(function (resolve) {
    s3Bucket.upload(data)
      .promise()
      .then(result => {
        response.error = false
        response.data = { location: result.Location }
        resolve(response)
      }).catch((err) => {
        console.error(err)
        response.error = true
        response.data = err
        resolve(response)
      })
  })
}

require('dotenv').config()
const { hashPassword, sendMail, randomString, generateToken, comparePassword, generateUUID, currentDateTimeDbFormat, _emptyObject, filesUploadLocal } = require('../utils/common')
const { insertModel, rawQueryModel, countModel, fetchOneModel, updateModel } = require('../repositories/myModel-repository');
const Auth = require('../repositories/auth-repository');
const { getResponse } = require('../utils/response');
// const moment = require('moment');
// const fileUpload = require('express-fileupload');
// const { verify } = require('jsonwebtoken');
// const user_c = 'users_c';
// const user_e = 'user_e';

module.exports.Addnewusers = async (req, callback) => {
    try {
        const { name, email, phone, password, role } = req.body
        let PromiseFunc = new Promise(async function (Resolve, Reject) {
            let condition = { 'and': { email: email }, 'and': { phone: phone } };
            const checkEmail = await countModel('users', condition);

            if (!checkEmail.error && checkEmail.data.count === 0) {

                const hasPassword = await hashPassword(password, process.env.SALT)
                const data = {
                    username: name,
                    email: email,
                    password: hasPassword.data,
                    role: role,
                    phone: phone,
                    verified: '0',
                    social_links: '0',
                    preferences: '0',
                    cby: "1",
                    mby: "1",
                }
                var insertData = await insertModel('users', data)
                console.log(insertData)
                const user_d = {
                    u_id: insertData.data?.insertId

                }
                var user_details = await insertModel('users_details', user_d)
                if (insertData.error) {
                    Reject(`CUSTOM_MSG: $[1],${insertData.sqlMessage}`)
                } else {
                    Resolve(insertData)
                }
            } else {
                if (!checkEmail.error && !_emptyObject(checkEmail.data)) {
                    var errTrueMsg = (checkEmail.sqlMessage) ? `CUSTOM_MSG: $[1],${checkEmail.sqlMessage}` : 'EXIST: $[1],Email';
                    Reject(errTrueMsg)
                }
            }
        });
        PromiseFunc.then(
            function (value) {
                return callback(getResponse(200, value, 'INSERTED'))
            },
            function (error) {
                return callback(getResponse(400, {}, error))
            }
        );
    } catch (err) {
        console.log(err)
        return callback(getResponse())
    }
}
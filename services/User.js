require('dotenv').config()
const { hashPassword, sendMail, randomString, generateToken, comparePassword, generateUUID, currentDateTimeDbFormat, _emptyObject, filesUploadLocal, generateOTP } = require('../utils/common')
const { insertModel, rawQueryModel, countModel, fetchOneModel, updateModel, deleteModel } = require('../repositories/myModel-repository');
const Auth = require('../repositories/auth-repository');
const { getResponse } = require('../utils/response');
const sendmailotp = require('../utils/otpmail');
const { SUCCESS } = require('../utils/error-msg');
// const moment = require('moment');
// const fileUpload = require('express-fileupload');
// const { verify } = require('jsonwebtoken');
// const user_c = 'users_c';
// const user_e = 'user_e';

module.exports.Addnewusers = async (req, callback) => {
    try {
        const { name, email, phone, password, role, domain, country_code } = req.body
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
                    domain: domain,
                    country: country_code,
                    verified: '0',
                    social_links: '0',
                    preferences: '0',
                    cby: "1",
                    mby: "1",
                }
                var insertData = await insertModel('users', data)
                const otpgenarte = generateOTP(4)

                const sendm = sendmailotp(email, name, otpgenarte)

                const user_d = {
                    u_id: insertData.data?.insertId

                }
                var user_details = await insertModel('users_details', user_d)
                const otpint = {
                    otp_code: otpgenarte,
                    user_id: insertData.data?.insertId
                }
                var otpfunstion = await insertModel('otp', otpint)
                if (otpfunstion.error) {
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


module.exports.VerifyOTP = async (req, callback) => {
    try {
        const { otp_code, user_id } = req.body;
        // console.log(SUCCESS?.OTP?.default)
        // Validate input

        if (!otp_code || !user_id) {
            return callback(getResponse(400, {}, "OTP"));
        }

        // Check if the OTP is valid for the given user
        const condition = { and: { otp_code: otp_code, user_id: user_id } };
        const checkOtp = await countModel('otp', condition);

        if (checkOtp.error) {
            return callback(getResponse(500, {}, `DB_ERROR: ${checkOtp.sqlMessage}`));
        }

        if (checkOtp.data.count === 0) {
            return callback(getResponse(400, {}, "OTP"));
        }

        // Mark the user as verified
        const updateData = { verified: '1' }; // Mark user as verified
        const updateCondition = { id: user_id };
        const updateResult = await updateModel('users', updateData, updateCondition);

        if (updateResult.error) {
            return callback(getResponse(500, {}, `DB_ERROR: ${updateResult.sqlMessage}`));
        }

        // Clean up: Delete the used OTP
        const deleteOtpCondition = { user_id: user_id };
        const deleteOtp = await deleteModel('otp', deleteOtpCondition);

        if (deleteOtp.error) {
            console.error(`OTP_CLEANUP_ERROR: ${deleteOtp.sqlMessage}`);
        }
        // console.log(deleteOtp)

        return callback(getResponse(200, deleteOtp, 'OTP'))


    } catch (err) {
        console.error(err);
        return callback(getResponse())
    }
};
module.exports.job_seeker_stage_one = async (req, callback) => {
    try {
        const { exp, location, user_id } = req.body;


        let condition = { 'and': { email: email } };


        const user_d = {
            experience_status: exp,
            location: location

        }
        var user_details = await updateModel('users_details', user_d, con)

        if (deleteOtp.error) {
            console.error(`OTP_CLEANUP_ERROR: ${deleteOtp.sqlMessage}`);
        }
        // console.log(deleteOtp)   

        return callback(getResponse(200, deleteOtp, 'OTP'))


    } catch (err) {
        console.error(err);
        return callback(getResponse())
    }
};


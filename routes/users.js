const express = require('express');
const https = require('https');
const router = express.Router()
const { check, body, validationResult } = require('express-validator')
const {
    Addnewusers,
    VerifyOTP,
    job_seeker_stage_one

} = require('../services/User')
const { requestHandler, ctrlHandler } = require('../utils/error-handler')
const { verifyAuthToken, statusCode } = require('../utils/common');


router.post('/user', [
    check('name').notEmpty().withMessage('REQUIRED: $[1],name'),
    check('email').notEmpty().withMessage('REQUIRED: $[1],email'),
    check('phone').notEmpty().withMessage('REQUIRED: $[1],phone'),
    check('password').notEmpty().withMessage('REQUIRED: $[1],password'),
    check('role').notEmpty().withMessage('REQUIRED: $[1],role'),
    check('domain').notEmpty().withMessage('REQUIRED: $[1],domain'),
    check('country_code').notEmpty().withMessage('REQUIRED: $[1],country_code'),

], (req, res) => {

    const error = validationResult(req).array();
    if (error.length) {
        requestHandler(error, true, (message) => {
            return res.status(403).json(message)
        })
    }
    else {
        Addnewusers(req, (result) => {
            ctrlHandler(result, (message) => {
                return res.status(statusCode(result)).json(message)
            })
        })
    }
})
router.post('/verify_otp', [
    check('otp_code').notEmpty().withMessage('REQUIRED: $[1],otp'),
    check('user_id').notEmpty().withMessage('REQUIRED: $[1],user_id'),


], (req, res) => {

    const error = validationResult(req).array();
    if (error.length) {
        requestHandler(error, true, (message) => {
            return res.status(403).json(message)
        })
    }
    else {
        VerifyOTP(req, (result) => {
            ctrlHandler(result, (message) => {
                return res.status(statusCode(result)).json(message)
            })
        })
    }
})

router.post('/job_seeker/stage_one', [
    check('exp').notEmpty().withMessage('REQUIRED: $[1],exp'),
    check('location').notEmpty().withMessage('REQUIRED: $[1],live_location'),
    check('user_id').notEmpty().withMessage('REQUIRED: $[1],user_id'),



], (req, res) => {

    const error = validationResult(req).array();
    if (error.length) {
        requestHandler(error, true, (message) => {
            return res.status(403).json(message)
        })
    }
    else {
        job_seeker_stage_one(req, (result) => {
            ctrlHandler(result, (message) => {
                return res.status(statusCode(result)).json(message)
            })
        })
    }
})

module.exports = router

const express = require('express');
const https = require('https');
const router = express.Router()
const { check, body, validationResult } = require('express-validator')
const {
    Addnewusers

} = require('../services/User')
const { requestHandler, ctrlHandler } = require('../utils/error-handler')
const { verifyAuthToken, statusCode } = require('../utils/common');

router.post('/user', [
    check('name').notEmpty().withMessage('REQUIRED: $[1],name'),
    check('email').notEmpty().withMessage('REQUIRED: $[1],email'),
    check('phone').notEmpty().withMessage('REQUIRED: $[1],phone'),
    check('password').notEmpty().withMessage('REQUIRED: $[1],password'),
    check('role').notEmpty().withMessage('REQUIRED: $[1],role'),

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

module.exports = router

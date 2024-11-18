const router = require('express').Router()
const { check, param, validationResult } = require('express-validator')
const {verifyAuthToken, statusCode} = require('../utils/common');
const Roles = require('./../services/roles-service')
const { requestHandler, ctrlHandler } = require('./../utils/error-handler')

router.post('/', verifyAuthToken, [
  check('name').notEmpty().withMessage('REQUIRED: $[1],Role name'),
  check('description').notEmpty().withMessage('REQUIRED: $[1],Description'),
  check('modules').notEmpty().withMessage('REQUIRED: $[1],Modules').isArray().withMessage('CUSTOM_MSG: $[1],Modules dataType is invalid must be an Array'),
  check('status').notEmpty().withMessage('REQUIRED: $[1],Status')
], (req, res) => {
  const error = validationResult(req).array();
  if (error.length) {
    requestHandler(error, true, (message) => {
      return res.status(400).json(message)
    })
  } else {
    Roles.createRoles(req, (result) => {
      ctrlHandler(result, (message) => {
        return res.status(statusCode(result)).json(message)
      })
    })
  } 
})

router.patch('/', verifyAuthToken, [
  check('id').notEmpty().withMessage('REQUIRED: $[1],Role id'),
  check('name').notEmpty().withMessage('REQUIRED: $[1],Role name'),
  check('description').notEmpty().withMessage('REQUIRED: $[1],Description'),
  check('modules').notEmpty().withMessage('REQUIRED: $[1],Modules').isArray().withMessage('CUSTOM_MSG: $[1],Modules dataType is invalid must be an Array'),
  check('status').notEmpty().withMessage('REQUIRED: $[1],Status')
], (req, res) => {
  const error = validationResult(req).array();
  if (error.length) {
    requestHandler(error, true, (message) => {
      return res.status(400).json(message)
    })
  } else {
    Roles.updateRoles(req, (result) => {
      ctrlHandler(result, (message) => {
        return res.status(statusCode(result)).json(message)
      })
    })
  } 
})

router.get('/', verifyAuthToken, (req, res) =>{
  Roles.listRoles(req, (result) => {
    ctrlHandler(result, (message) => {
      return res.status(statusCode(result)).json(message)
    })
  })
})

router.get('/customer/list', verifyAuthToken, (req, res) =>{
  Roles.customerAddedRoleList(req, (result) => {
    ctrlHandler(result, (message) => {
      return res.status(statusCode(result)).json(message)
    })
  })
})

router.get('/:id', verifyAuthToken, [
  param('id').notEmpty().withMessage('REQUIRED: $[1],Role id').isInt().withMessage('NUMERIC: $[1],Role id'),
], (req, res) =>{
  const error = validationResult(req).array();
  if (error.length) {
    requestHandler(error, true, (message) => {
      return res.status(400).json(message)
    })
  } else {
    Roles.editRoles(req, (result) => {
      ctrlHandler(result, (message) => {
        return res.status(statusCode(result)).json(message)
      })
    })
  } 
})

router.delete('/:id', verifyAuthToken, (req, res) =>{
  Roles.deleteRoles(req, (result) => {
    ctrlHandler(result, (message) => {
      return res.status(statusCode(result)).json(message)
    })
  })
})

module.exports = router
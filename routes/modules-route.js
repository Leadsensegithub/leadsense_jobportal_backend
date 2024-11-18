const router = require('express').Router()
const { check, validationResult } = require('express-validator')
const {verifyAuthToken, statusCode} = require('../utils/common');
const Modules = require('./../services/modules-service')
const { requestHandler, ctrlHandler } = require('./../utils/error-handler')


router.post('/', verifyAuthToken, [
  check('page_name').notEmpty().withMessage('REQUIRED: $[1],Module name')
], (req, res) => {
  const error = validationResult(req).array();
  if (error.length) {
    requestHandler(error, true, (message) => {
      return res.status(400).json(message)
    })
  } else {
    Modules.createModules(req, (result) => {
      ctrlHandler(result, (message) => {
        return res.status(statusCode(result)).json(message)
      })
    })
  } 
})

router.patch('/', verifyAuthToken, [
  check('id').notEmpty().withMessage('REQUIRED: $[1],Module id'),
  check('page_name').notEmpty().withMessage('REQUIRED: $[1],Module name'),
], (req, res) => {
  const error = validationResult(req).array();
  if (error.length) {
    requestHandler(error, true, (message) => {
      return res.status(400).json(message)
    })
  } else {
    Modules.updateModules(req, (result) => {
      ctrlHandler(result, (message) => {
        return res.status(statusCode(result)).json(message)
      })
    })
  } 
})

router.get('/', verifyAuthToken,(req, res) =>{
  Modules.listModules(req, (result) => {
    ctrlHandler(result, (message) => {
      return res.status(statusCode(result)).json(message)
    })
  })
})

router.get('/:id', verifyAuthToken, (req, res) =>{
  Modules.editModules(req, (result) => {
    ctrlHandler(result, (message) => {
      return res.status(statusCode(result)).json(message)
    })
  })
})

router.delete('/:id', verifyAuthToken, (req, res) =>{
  Modules.deleteModules(req, (result) => {
    ctrlHandler(result, (message) => {
      return res.status(statusCode(result)).json(message)
    })
  })
})

module.exports = router
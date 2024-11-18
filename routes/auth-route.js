const express = require('express');
const https = require('https');
const router = express.Router()

const { check, body, validationResult } = require('express-validator')
const {
  createAuthService,
  UniversityAdd,
  Addunicontent,
  Universitycourses,
  Studentform,
  Addprofessor,
  authLogin,
  Getunivercity,
  GetProfessor,
  AddTheme,
  AddSelection,
  Getalluniversity,
  createEployeeService,
  EmployeeMultipledata,
  EmployeeTimecontroller
} = require('../services/auth-service')
const { requestHandler, ctrlHandler } = require('../utils/error-handler')
const { verifyAuthToken, statusCode } = require('../utils/common');

router.post('/adduniversity', [
  check('college_name').notEmpty().withMessage('REQUIRED: $[1], College name'),
  check('location').notEmpty().withMessage('REQUIRED: $[1], Location'),
  check('abroad').notEmpty().withMessage('REQUIRED: $[1], Abroad'),

], (req, res) => {

  const error = validationResult(req).array();
  if (error.length) {
    requestHandler(error, true, (message) => {
      return res.status(403).json(message)
    })
  } else {
    if (!req.files || !req.files.college_logo) {
      return res.status(400).json({
        "status": 400,
        "error": true,
        "message": {
          "college_logo": " college_logo is required"
        }
      });
    } if (!req.files || !req.files.college_back) {
      return res.status(400).json({
        "status": 400,
        "error": true,
        "message": {
          "college_back": " college_back is required"
        }
      });
    } else {
      UniversityAdd(req, (result) => {
        ctrlHandler(result, (message) => {
          return res.status(statusCode(result)).json(message)
        })
      })
    }
  }
})
router.post('/addunicontent', [
  check('uni_id').notEmpty().withMessage('REQUIRED: $[1], uni_id '),
  check('line1').notEmpty().withMessage('REQUIRED: $[1], uni_id '),
  check('line2').notEmpty().withMessage('REQUIRED: $[1], uni_id '),




], (req, res) => {

  const error = validationResult(req).array();
  if (error.length) {
    requestHandler(error, true, (message) => {
      return res.status(403).json(message)
    })
  } else {

    Addunicontent(req, (result) => {
      ctrlHandler(result, (message) => {
        return res.status(statusCode(result)).json(message)
      })
    })

  }
})
router.post('/universitycourses', [
  check('uni_id').notEmpty().withMessage('REQUIRED: $[1], uni_id '),
  check('courses').notEmpty().withMessage('REQUIRED: $[1], uni_id '),
  check('duration_month').notEmpty().withMessage('REQUIRED: $[1], uni_id '),
  check('amount').notEmpty().withMessage('REQUIRED: $[1], uni_id '),
  check('about_co').notEmpty().withMessage('REQUIRED: $[1], uni_id '),
  check('certifications').notEmpty().withMessage('REQUIRED: $[1], uni_id '),
  check('co_start').notEmpty().withMessage('REQUIRED: $[1], uni_id '),
  check('top_skills').notEmpty().withMessage('REQUIRED: $[1], uni_id '),
  check('job_opportunities').notEmpty().withMessage('REQUIRED: $[1], uni_id '),
  check('program_for').notEmpty().withMessage('REQUIRED: $[1], uni_id '),
  check('minimum_eligibility').notEmpty().withMessage('REQUIRED: $[1], uni_id '),
  check('brochure').notEmpty().withMessage('REQUIRED: $[1], uni_id '),
], (req, res) => {

  const error = validationResult(req).array();
  if (error.length) {
    requestHandler(error, true, (message) => {
      return res.status(403).json(message)
    })
  } else {

    Universitycourses(req, (result) => {
      ctrlHandler(result, (message) => {
        return res.status(statusCode(result)).json(message)
      })
    })

  }
})
router.post('/studentform', [

  check('contact').notEmpty().withMessage('REQUIRED: $[1], uni_id '),
  check('name').notEmpty().withMessage('REQUIRED: $[1], uni_id '),
  check('email').notEmpty().withMessage('REQUIRED: $[1], uni_id '),
  check('co_id').notEmpty().withMessage('REQUIRED: $[1], uni_id '),

], (req, res) => {

  const error = validationResult(req).array();
  if (error.length) {
    requestHandler(error, true, (message) => {
      return res.status(403).json(message)
    })
  } else {

    Studentform(req, (result) => {
      ctrlHandler(result, (message) => {
        return res.status(statusCode(result)).json(message)
      })
    })

  }
})
router.post('/addprofessor', [

  check('uni_id').notEmpty().withMessage('REQUIRED: $[1], uni_id '),
  check('professor_name').notEmpty().withMessage('REQUIRED: $[1], uni_id '),



], (req, res) => {

  const error = validationResult(req).array();
  if (error.length) {
    requestHandler(error, true, (message) => {
      return res.status(403).json(message)
    })
  } else {
    if (!req.files || !req.files.pro_img) {
      return res.status(400).json({
        "status": 400,
        "error": true,
        "message": {
          "pro_img": " pro_img is required"
        }
      });
    } else {

      Addprofessor(req, (result) => {
        ctrlHandler(result, (message) => {
          return res.status(statusCode(result)).json(message)
        })
      })
    }
  }
})
router.post('/generate-payment-link', (req, res) => {
  const amount = req.body.amount;
  const customerName = req.body.customerName;
  // Add other required parameters

  const merchantId = process.env.HDFC_MERCHANT_ID; // Replace with your actual merchant ID
  const accessCode = process.env.HDFC_ACCESS_CODE; // Replace with your actual access code
  const secureHashKey = process.env.HDFC_SECURE_HASH_KEY; // Replace with your actual secure hash key
  const currency = 'INR'; // Indian Rupees

  // Construct the payment request parameters
  const paymentParams = JSON.stringify({
    amount,
    customerName,
    // Add other parameters as required by HDFC Bank Payment Gateway
    merchantId,
    accessCode,
    currency,
    // Add secure hash key
  });

  // Define request options
  const options = {
    hostname: 'example.com', // Replace with HDFC Bank Payment Gateway hostname
    port: 443, // HTTPS port
    path: '/payment-api', // Replace with HDFC Bank Payment Gateway API path
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': paymentParams.length,
    },
  };

  // Make the HTTP request
  const request = https.request(options, response => {
    let data = '';

    response.on('data', chunk => {
      data += chunk;
    });

    response.on('end', () => {
      const paymentLink = JSON.parse(data).paymentLink;
      res.redirect(paymentLink); // Redirect the user to the generated payment link
    });
  });

  request.on('error', error => {
    console.error('Error generating payment link:', error);
    res.status(500).send('Error generating payment link');
  });

  request.write(paymentParams);
  request.end();
});

router.get('/getuniversity', (req, res) => {
  Getunivercity(req, (result) => {
    ctrlHandler(result, (message) => {
      return res.status(statusCode(result)).json(message)
    })
  })
})
router.get('/getalluniversity', (req, res) => {
  Getalluniversity(req, (result) => {
    ctrlHandler(result, (message) => {
      return res.status(statusCode(result)).json(message)
    })
  })
})
router.get('/getuniprofessor', [
  check('uni_id').notEmpty().withMessage('REQUIRED: $[1], uni_id '),
], (req, res) => {

  const error = validationResult(req).array();
  if (error.length) {
    requestHandler(error, true, (message) => {
      return res.status(403).json(message)
    })
  } else {
    GetProfessor(req, (result) => {
      ctrlHandler(result, (message) => {
        return res.status(statusCode(result)).json(message);
      });
    });
  }
});
router.get('/addtheme', [
  check('name').notEmpty().withMessage('REQUIRED: $[1], uni_id '),
  check('theme').notEmpty().withMessage('REQUIRED: $[1], uni_id '),
], (req, res) => {

  const error = validationResult(req).array();
  if (error.length) {
    requestHandler(error, true, (message) => {
      return res.status(403).json(message)
    })
  } else {
    AddTheme(req, (result) => {
      ctrlHandler(result, (message) => {
        return res.status(statusCode(result)).json(message);
      });
    });
  }
});
router.post('/addsection', [
  check('selectname').notEmpty().withMessage('REQUIRED: $[1], uni_id '),
  check('content').notEmpty().withMessage('REQUIRED: $[1], uni_id '),
], (req, res) => {

  const error = validationResult(req).array();
  if (error.length) {
    requestHandler(error, true, (message) => {
      return res.status(403).json(message)
    })
  } else {
    AddSelection(req, (result) => {
      ctrlHandler(result, (message) => {
        return res.status(statusCode(result)).json(message);
      });
    });
  }
});


router.post('/company/auth/signup', [

  check('c_name').notEmpty().withMessage('REQUIRED: $[1],company name'),
  check('o_name').notEmpty().withMessage('REQUIRED: $[1], owner name'),
  check('c_email').notEmpty().withMessage('REQUIRED: $[1],Email').isEmail().withMessage('INVALID: $[1],Email'),
  check('c_password').notEmpty().withMessage('REQUIRED: $[1], password'),
  check('o_number').notEmpty().withMessage('REQUIRED: $[1], Owner number'),
  check('c_number').notEmpty().withMessage('REQUIRED: $[1], Company number'),
], (req, res) => {
  const error = validationResult(req).array();
  if (error.length) {
    requestHandler(error, true, (message) => {
      return res.status(403).json(message)
    })
  } else {
    createAuthService(req, (result) => {
      ctrlHandler(result, (message) => {
        return res.status(statusCode(result)).json(message)
      })
    })
  }
})
router.post('/employee/auth/signup', verifyAuthToken, [

  check('e_name').notEmpty().withMessage('REQUIRED: $[1], Employee name'),
  check('e_email').notEmpty().withMessage('REQUIRED: $[1],Email').isEmail().withMessage('INVALID: $[1],Email'),
  check('e_password').notEmpty().withMessage('REQUIRED: $[1], password'),
  check('e_number').notEmpty().withMessage('REQUIRED: $[1], Employee number'),
  check('e_role').notEmpty().withMessage('REQUIRED: $[1], Employee role'),
], (req, res) => {
  const error = validationResult(req).array();
  if (error.length) {
    requestHandler(error, true, (message) => {
      return res.status(403).json(message)
    })
  } else {
    createEployeeService(req, (result) => {
      ctrlHandler(result, (message) => {
        return res.status(statusCode(result)).json(message)
      })
    })
  }
})

router.post('/auth/login', [
  check('c_type').notEmpty().withMessage('REQUIRED: $[1],Type').isIn(['1', '2', '3']).withMessage('CUSTOM_MSG: $[1],The action value must be admin or customer or user is required'),
  check('c_email').notEmpty().withMessage('REQUIRED: $[1],Email or Username').isEmail().withMessage('INVALID: $[1],Email'),
  check('c_password').notEmpty().withMessage('REQUIRED: $[1],Password').isLength({ min: 6, max: 60 }).withMessage('TEXT_LIMIT: $[1] $[2] $[3],Password,6,60'),
], (req, res) => {
  const error = validationResult(req).array();
  if (error.length) {
    requestHandler(error, true, (message) => {
      return res.status(403).json(message)
    })
  } else {
    authLogin(req, (result) => {
      ctrlHandler(result, (message) => {
        console.log(message.data)
        return res.status(statusCode(result)).json(message)
      })
    })
  }
})


router.get('/employee/auth/data', verifyAuthToken, (req, res) => {
  EmployeeMultipledata(req, (result) => {
    ctrlHandler(result, (message) => {
      return res.status(statusCode(result)).json(message)
    })
  })
})

router.get('/employee/auth/timecontroller', verifyAuthToken, (req, res) => {
  EmployeeTimecontroller(req, (result) => {
    ctrlHandler(result, (message) => {
      return res.status(statusCode(result)).json(message)
    })
  })
})




module.exports = router

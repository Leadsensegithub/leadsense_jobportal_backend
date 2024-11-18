require('dotenv').config()
const { hashPassword, sendMail, randomString, generateToken, comparePassword, generateUUID, currentDateTimeDbFormat, _emptyObject, filesUploadLocal } = require('../utils/common')
const { insertModel, rawQueryModel, countModel, fetchOneModel, updateModel } = require('../repositories/myModel-repository');
const Auth = require('../repositories/auth-repository');
const { getResponse } = require('../utils/response');
const moment = require('moment');
const fileUpload = require('express-fileupload');
const user_c = 'users_c';
const user_e = 'user_e';

module.exports.createAuthService = async (req, callback) => {
  try {
    const { c_name, o_name, c_email, c_password, c_logo, o_number, c_number } = req.body
    let PromiseFunc = new Promise(async function (Resolve, Reject) {
      let condition = { 'and': { c_email: c_email } };
      const checkEmail = await countModel(user_c, condition);
      console.log('checkEmail', checkEmail)
      if (!checkEmail.error && checkEmail.data.count === 0) {
        const file = await filesUploadLocal(req, 'logo', 'uploads/images/user')
        const currentDate = moment();
        const futureDate = currentDate.add(25, "days");
        const formattedDate = futureDate.format("YYYY-MM-DD");
        const hasPassword = await hashPassword(c_password, process.env.SALT)
        const data = {
          c_name: c_name,
          o_name: o_name,
          c_email: c_email,
          c_password: hasPassword.data,
          free_trial: formattedDate,
          free_trial_days: "25",
          o_number: o_number,
          c_number: c_number,
          c_logo: "http://localhost:4000/" + file.uploadPath,
          status: "1",
          c_active: "1",
          cby: "1",
          mby: "1",
        }
        var insertData = await insertModel(user_c, data)
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

module.exports.createEployeeService = async (req, callback) => {
  try {
    const { e_name, e_email, e_password, e_number, e_role } = req.body
    const { userId } = req.user

    let PromiseFunc = new Promise(async function (Resolve, Reject) {
      let condition = { 'and': { e_email: e_email } };
      const checkEmail = await countModel(user_e, condition);
      console.log('checkEmail', checkEmail)
      if (!checkEmail.error && checkEmail.data.count === 0) {
        const file = await filesUploadLocal(req, 'profile', 'uploads/images/user')

        const hasPassword = await hashPassword(e_password, process.env.SALT)
        const data = {
          e_key_id: generateUUID(),
          user_c_id: userId,
          e_name: e_name,
          e_email: e_email,
          e_password: hasPassword.data,
          e_number: e_number,
          e_photo: "http://localhost:4000/" + file.uploadPath,
          status: "1",
          e_active: "1",
          e_role: e_role,
          cby: "1",
          mby: "1",
        }
        var insertData = await insertModel(user_e, data)
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



module.exports.UniversityAdd = async (req, callback) => {
  try {
    const { college_name, location, abroad } = req.body;
    const collegeLogo = req.files.college_logo;
    const fileName = `${Date.now()}_${collegeLogo.name}`;
    const uploadPath = `./uploads/UniversityLogo/${fileName}`;
    await collegeLogo.mv(uploadPath);
    const collegeBlack = req.files.college_back;
    const fileNameBack = `${Date.now()}_${collegeBlack.name}`;
    const uploadPathBack = `./uploads/universityBackground/${fileNameBack}`;
    await collegeBlack.mv(uploadPathBack);
    const userData = {
      college_name: college_name,
      location: location,
      abroad: abroad,
      college_back: `/uploads/UniversityLogo/${fileName}`,
      college_logo: `/uploads/universityBackground/${fileName}`
    };
    const insertData = await insertModel('university', userData);

    if (insertData.error) {
      return callback(getResponse(400, {}, `ERROR: ${insertData.sqlMessage}`));
    }

    return callback(getResponse(200, { college_logo_url: `/uploads/${fileName}` }, 'INSERTED'));
  } catch (err) {
    console.log(err);
    return callback(getResponse());
  }
};
module.exports.Addunicontent = async (req, callback) => {
  try {
    const { uni_id, line2, line1 } = req.body;

    const userData = {
      uni_id: uni_id,
      info_line_1: line1,
      info_line_2: line2,

    };
    const insertData = await insertModel('univercity_details', userData);

    if (insertData.error) {
      return callback(getResponse(400, {}, `ERROR: ${insertData.sqlMessage}`));
    }

    return callback(getResponse(200, 'INSERTED'));
  } catch (err) {
    console.log(err);
    return callback(getResponse());
  }
};
module.exports.Universitycourses = async (req, callback) => {
  try {
    const { uni_id, courses, duration_month, amount, about_co, certifications, co_start, top_skills, job_opportunities, program_for, minimum_eligibility, brochure } = req.body;

    const userData = {
      uni_id: uni_id,
      duration_month: duration_month,
      amount: amount,
      courses: courses,
      about_co: about_co,
      certifications: certifications,
      co_start: co_start,
      top_skills: top_skills,
      job_opportunities: job_opportunities,
      program_for: program_for,
      minimum_eligibility: minimum_eligibility,
      brochure: brochure,
      cby: "1"

    };
    const insertData = await insertModel('courses', userData);

    if (insertData.error) {
      return callback(getResponse(400, {}, `ERROR: ${insertData.sqlMessage}`));
    }

    return callback(getResponse(200, 'INSERTED'));
  } catch (err) {
    console.log(err);
    return callback(getResponse());
  }
};
module.exports.Studentform = async (req, callback) => {
  try {
    const { co_id, email, contact, name } = req.body;

    const userData = {
      co_id: co_id,
      email: email,
      contact: contact,
      name: name,

      cby: "1"

    };
    const insertData = await insertModel('student_from', userData);

    if (insertData.error) {
      return callback(getResponse(400, {}, `ERROR: ${insertData.sqlMessage}`));
    }

    return callback(getResponse(200, 'INSERTED'));
  } catch (err) {
    console.log(err);
    return callback(getResponse());
  }
};
module.exports.Getunivercity = async (req, callback) => {
  try {

    const response = { error: false, data: {} };

    var { error, data } = await rawQueryModel(`SELECT u.id,u.college_name,u.college_logo,u.college_back,u.location,ud.info_line_1,ud.info_line_2
    FROM university as u
    LEFT JOIN univercity_details as ud  ON u.id = ud.uni_id WHERE u.id ='1'`);

    response.data.university = data;
    console.log(data[0]?.id)
    var { error, data } = await rawQueryModel(`Select courses,duration_month,amount,about_co,certifications,co_start,top_skills,job_opportunities,program_for,minimum_eligibility,brochure From courses Where uni_id=${data[0]?.id}`);

    response.data.Courses = data;
    // console.log('response', response)
    return callback(getResponse(200, response, 'FETCHED'))
  } catch (err) {
    return callback(getResponse())
  }
}
module.exports.Getalluniversity = async (req, callback) => {
  try {

    const response = { error: false, data: {} };

    var { error, data } = await rawQueryModel(`SELECT u.id,u.college_name,u.college_logo,u.college_back,u.location,ud.info_line_1,ud.info_line_2
    FROM university as u
    LEFT JOIN univercity_details as ud  ON u.id = ud.uni_id`);

    response.data.university = data;
   
    return callback(getResponse(200, response, 'FETCHED'))
  } catch (err) {
    return callback(getResponse())
  }
}
module.exports.GetProfessor = async (req, callback) => {
  try {

    const response = { error: false, data: {} };

    var { error, data } = await rawQueryModel(`SELECT * FROM professor WHERE uni_id =${req?.body?.uni_id}`);

    response.data.university = data;
   
    return callback(getResponse(200, response, 'FETCHED'))
  } catch (err) {
    return callback(getResponse())
  }
}

module.exports.Addprofessor = async (req, callback) => {
  try {
    const { uni_id, professor_name } = req.body;
    const collegeLogo = req.files.pro_img;
    const fileName = `${Date.now()}_${collegeLogo.name}`;
    const uploadPath = `./uploads/Professor/${fileName}`;
    await collegeLogo.mv(uploadPath);

    const userData = {
      uni_id: uni_id,
      professor_name: professor_name,
      pro_img: `/uploads/Professor/${fileName}`,

    };
    const insertData = await insertModel('professor', userData);

    if (insertData.error) {
      return callback(getResponse(400, {}, `ERROR: ${insertData.sqlMessage}`));
    }

    return callback(getResponse(200, { college_logo_url: `/uploads/${fileName}` }, 'INSERTED'));
  } catch (err) {
    console.log(err);
    return callback(getResponse());
  }
};
module.exports.AddTheme = async (req, callback) => {
  try {
    const { name, theme } = req.body;
 

    const userData = {
      name: name,
      color: theme,
     

    };
    const insertData = await insertModel('theme', userData);

    if (insertData.error) {
      return callback(getResponse(400, {}, `ERROR: ${insertData.sqlMessage}`));
    }

    return callback(getResponse(200, 'INSERTED'));
  } catch (err) {
    console.log(err);
    return callback(getResponse());
  }
};
module.exports.AddSelection = async (req, callback) => {
  try {
    const { selectname, content } = req.body;
 

    const userData = {
      selection: selectname,
      content: content,
     

    };
    const insertData = await insertModel('landingpage', userData);

    if (insertData.error) {
      return callback(getResponse(400, {}, `ERROR: ${insertData.sqlMessage}`));
    }

    return callback(getResponse(200, 'INSERTED'));
  } catch (err) {
    console.log(err);
    return callback(getResponse());
  }
};

module.exports.authLogin = async (req, callback) => {
  try {
    const { c_type, c_email, c_password } = req.body;
    console.log(req.body)
    if (c_type == '1') {
      const checkEmail = await Auth.Login(req);
      console.log(checkEmail)
      const data = checkEmail.data;
      if (!checkEmail.error && !_emptyObject(checkEmail.data)) { //check email
        const checkPassword = await comparePassword(c_password, data.c_password);
        if (!checkPassword.error) { //check password
          const authToken = await generateToken({ userId: data.id, userUuid: data.uuid, type: data.c_type });
          if (!authToken.error) {  //check token generate
            const response = {}
            response.error = false
            response.data = {
              id: data.id,
              free_trial: data.free_trial,
              name: data.o_name,
              email: data.c_email,
              free_trial_days: data.free_trial_days,
              authToken: authToken.data
            }
            return callback(getResponse(200, response, 'LOGIN_SUCCESS'))
          } else {
            return callback(getResponse())
          }
        } else {
          return callback(getResponse(403, {}, 'INVALID_PASSWORD'))
        }
      } else {
        return callback(getResponse(403, {}, 'NOTEXIST: $[1],Email'))
      }
    } else if (type === '2') {
      const checkEmail = await Auth.customerLogin(req);
      console.log('checkEmail', checkEmail)
      if (!checkEmail.error && !_emptyObject(checkEmail.data)) {
        const data = checkEmail.data;
        console.log('data', data)
        const checkPassword = await comparePassword(password, data.password);
        console.log('checkPassword', checkPassword)
        if (!checkPassword.error) { //check password
          const authToken = await generateToken({ userId: data.id, userUuid: (data.uuid || null), type: data.type, email: data.email });
          if (!authToken.error) {  //check token generate
            const response = {}
            response.error = false
            response.data = {
              id: data.id,
              name: data.company_name,
              email: data.email,
              industry_type: data.industry_type,
              location: data.location,
              mobile_number: data.mobile_number,
              company_id: data.company_id,
              type: data.type,
              image: data.brand_logo,
              status: data.status,
              module_name: data.module_name,
              authToken: authToken.data
            }
            return callback(getResponse(200, response, 'LOGIN_SUCCESS'))
          } else {
            return callback(getResponse())
          }
        } else {
          return callback(getResponse(403, {}, 'INVALID_PASSWORD'))
        }
      } else {
        return callback(getResponse(403, {}, 'NOTEXIST: $[1],Email'))
      }
    } else if (type === '3') {
      const checkEmail = await Auth.customerUserLogin(req);
      console.log('checkEmail', checkEmail)
      if (!checkEmail.error && !_emptyObject(checkEmail.data)) {
        const data = checkEmail.data;
        // console.log(data)
        const checkPassword = await comparePassword(password, data.password);
        if (!checkPassword.error) {
          const authToken = await generateToken({ userId: data.id, type: data.type, email: data.email });
          if (!authToken.error) {
            const response = {}
            response.error = false
            response.data = {
              id: data.id,
              name: data.name,
              email: data.email,
              role_name: data.role_name,
              type: data.type,
              image: data.image,
              status: data.status,
              module_name: data.module_name,
              authToken: authToken.data
            }
            return callback(getResponse(200, response, 'LOGIN_SUCCESS'))
          } else {
            return callback(getResponse())
          }
        } else {
          return callback(getResponse(403, {}, 'INVALID_PASSWORD'))
        }
      } else {
        return callback(getResponse(403, {}, 'NOTEXIST: $[1],Email'))
      }

    }

  } catch (err) {
    console.log(err)
    return callback(getResponse())
  }
}



module.exports.EmployeeMultipledata = async (req, callback) => {
  try {
    const { userId } = req?.user
    const response = { error: false, data: {} };

    var { error, data } = await rawQueryModel(`SELECT e.e_name as eployee_name,e.e_number as eployee_number,e.e_photo,e.e_role,e.e_join_d,e.e_key_id FROM user_e as e LEFT JOIN users_c as c ON e.user_c_id = c.id WHERE c.id=${userId};`);
    console.log(data)
    response.data.employee = data;
    // console.log('response', response)
    return callback(getResponse(200, response, 'FETCHED'))
  } catch (err) {
    return callback(getResponse())
  }
}
module.exports.EmployeeTimecontroller = async (req, callback) => {
  try {
    const { userId } = req?.user
    const response = { error: false, data: {} };

    var { error, data } = await rawQueryModel(`SELECT e.e_name as eployee_name,e.e_number as eployee_number,e.e_photo,e.e_role,e.e_join_d,e.e_key_id FROM user_e as e LEFT JOIN users_c as c ON e.user_c_id = c.id WHERE c.id=${userId};`);
    // console.log(data)
    response.data.employee = data;
    // console.log('response', response)
    return callback(getResponse(200, response, 'FETCHED'))
  } catch (err) {
    return callback(getResponse())
  }
}


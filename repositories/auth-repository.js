const config = require('../config/db-config');
const Knex = require('knex')

module.exports.Login = (req) => {
    const output = {};
    return new Promise(function (resolve) {
        const { type, c_email, password } = req.body;
        const knex = new Knex(config)
        knex('users_c')
        .select('')
        .where('c_email', c_email)

        .then(result => {
            if (result) {
                output.error = false
                output.data = (result[0])?result[0]:{}
            } else {
                output.error = true
            }
            resolve(output)
        })
        .catch((err) => {
            err.error = false
            resolve(err)
        })
        .finally(() => {
            knex.destroy()
        })
    })
}

module.exports.customerLogin = (req) => {
    const output = {};
    return new Promise(function (resolve) {
        const { type, email, password } = req.body;
        const knex = new Knex(config)
        knex('customer_details as C')
        .select('C.id','C.uuid','C.type','C.role','C.company_name','C.industry_type','C.location','C.mobile_number','C.vat_number','C.company_id','C.email','C.password','C.status')
        .select(knex.raw("CONCAT('images/customer/', C.brand_logo) as brand_logo"))
        // .select(knex.raw("CONCAT( '[', GROUP_CONCAT(DISTINCT JSON_OBJECT('id ', M.id ,'page_name', M.page_name,'status', M.status)), ']' ) as module_name"))
        .select(knex.raw("CONCAT( '[', GROUP_CONCAT(DISTINCT JSON_OBJECT('id', M.id ,'page_name', M.page_name,'status', M.status, 'add', RA.add, 'view', RA.view, 'edit', RA.edit, 'remove', RA.delete) ), ']' ) as module_name"))
        .leftJoin('role as R',  'R.id', 'C.role')
        // .joinRaw('LEFT JOIN modules AS M ON FIND_IN_SET( M.id,R.module_id)')
        .leftJoin('role_action AS RA', 'RA.role_id', 'R.id')
        .leftJoin('modules AS M', 'M.id', 'RA.module_id')
        .where('C.email', email)
        .whereNot('C.status',2)
        .then(result => {
            if (result) {
                output.error = false
                output.data = (result[0])?result[0]:{}
            } else {
                output.error = true
            }
            resolve(output)
        })
        .catch((err) => {
            err.error = false
            resolve(err)
        })
        .finally(() => {
            knex.destroy()
        })
    })
}

module.exports.customerUserLogin = (req) => {
    const output = {};
    return new Promise(function (resolve) {
        const { type, email, password } = req.body;
        console.log(email)
        const knex = new Knex(config)
        knex
        .select('CU.id','CU.type','CU.name','CU.email','CU.password','CU.role','CU.status','CU.customer_id','R.name as role_name','R.module_id')
        .select(knex.raw("CONCAT('images/user/', CU.user_profile) as image"))
        // .select(knex.raw("CONCAT( '[', GROUP_CONCAT(JSON_OBJECT('id ', M.id ,'page_name', M.page_name,'status', M.status)), ']' ) as module_name"))
        .select(knex.raw("CONCAT( '[', GROUP_CONCAT(DISTINCT JSON_OBJECT('id', M.id ,'page_name', M.page_name,'status', M.status, 'add', RA.add, 'view', RA.view, 'edit', RA.edit, 'remove', RA.delete) ), ']' ) as module_name"))
        .from('customer_user_details as CU')
        .leftJoin('role as R',  'R.id', 'CU.role')
        // .joinRaw('LEFT JOIN modules AS M ON FIND_IN_SET( M.id,R.module_id)')
        .leftJoin('role_action AS RA', 'RA.role_id', 'R.id')
        .leftJoin('modules AS M', 'M.id', 'RA.module_id')
        .where({'CU.email': email})
        .whereNot('CU.status','2')
        .then(result => {
            if (result) {
                output.error = false
                output.data = (result[0])?result[0]:{}
            } else {
                output.error = true
            }
            resolve(output)
        })
        .catch((err) => {
            console.log('err',err)
            err.error = false
            resolve(err)
        })
        .finally(() => {
            knex.destroy()
        })

    })
}

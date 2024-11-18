const config = require('../config/db-config');
const Knex = require('knex')

module.exports.editRoles = (id) => {
    const output = {};
    return new Promise(function (resolve) {
        const knex = new Knex(config)
        knex('role AS R')
        .select('R.id','R.name','R.description','R.module_id','R.status')
        .select(knex.raw("CONCAT( '[', GROUP_CONCAT(DISTINCT JSON_OBJECT('id', M.id ,'page_name', M.page_name,'status', M.status, 'add', RA.add, 'view', RA.view, 'edit', RA.edit, 'remove', RA.delete) ), ']' ) as module_name"))
        .leftJoin('role_action AS RA', 'RA.role_id', 'R.id')
        .leftJoin('modules AS M', 'M.id', 'RA.module_id')
        .whereNot({'R.status': 2})
        .where({'R.id':id})
        .then(result => {
            if (result) {
                output.error = false
                output.data = result[0] || {} 
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



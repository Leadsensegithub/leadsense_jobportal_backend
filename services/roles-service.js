const { _isInt, currentDateTimeDbFormat,_emptyArray } = require('./../utils/common')
const { insertModel, fetchModel, deleteModel, updateModel, rawQueryModel } = require('./../repositories/myModel-repository');
const Roles = require('./../repositories/roles-repository');
const {getResponse} = require('../utils/response');
const table = 'role';

module.exports.createRoles = async (req, callback) => {
    try {
        const { userId, type } = req.user;
        const { name, description, modules, status } = req.body;
        var modulesId = modules.map((item,i) => item.module_id).join();
        const data = {
            name: name,
            description: description,
            module_id: modulesId,
            status: ( status || 0 ),
            cby_type:type,
            cby:userId
        }
        const insertData = await insertModel(table, data);
        console.log('insertData',insertData)
        if (insertData.error) {
            return callback( getResponse(400, {}, `CUSTOM_MSG: $[1], ${insertData.sqlMessage}` ) )
        } else {
            if(!insertData.error){
                const role_action = [];
                modules.map((item,i) => {
                    var roleObj = new Object();
                    var { module_id, add, view, edit, remove } = item;
                    roleObj.role_id = insertData.data.insertId;
                    roleObj.module_id = module_id;
                    roleObj.add    = ( add || 0 );
                    roleObj.edit   = ( edit || 0 );
                    roleObj.view   = ( view || 0 );
                    roleObj.delete = (remove || 0);
                    roleObj.cby    = userId;
                    role_action.push(roleObj);
                })
                const insertRoleActionData = await insertModel('role_action', role_action);
                return callback( getResponse(200, insertData, 'INSERTED') )
            }else{
                return callback( getResponse() )
            }
        }
    } catch (err) {
        return callback( getResponse() )
    }
}

module.exports.updateRoles = async (req, callback) => {
    try {
        const {userId,type} = req.user;
        const { id, name, description, modules, status } = req.body;
        var modulesId = modules.map((item,i) => item.module_id).join();
        const data = {
            id: id,
            name: name,
            description: description,
            module_id: modulesId,
            status: ( status || 0 ),
            mby_type:type,
            mby:userId,
            mdate: currentDateTimeDbFormat()
        }
        console.log('data',data)
        let condition = { 'and':{id: id}, 'not':{status:2} };
        const updateData = await updateModel(table, data, condition)
        if (updateData.error) {
            var errTrueMsg = (updateData.sqlMessage) ? `CUSTOM_MSG: $[1],${updateData.sqlMessage}` : 'NOTEXIST: $[1],role data';
            return callback( getResponse(400, {}, errTrueMsg) )
        } else {
            if(!updateData.error){
                console.log('updateData',updateData)
                const deletePrevRoleAction = await deleteModel('role_action',{ role_id : id })
                console.log('deletePrevRoleAction',deletePrevRoleAction)
                const role_action = [];
                modules.map((item,i) => {
                    var roleObj = new Object();
                    var { module_id, add, view, edit, remove } = item;
                    roleObj.role_id = id;
                    roleObj.module_id = module_id;
                    roleObj.add    = ( add || 0 );
                    roleObj.edit   = ( edit || 0 );
                    roleObj.view   = ( view || 0 );
                    roleObj.delete = (remove || 0);
                    roleObj.cby    = userId;
                    roleObj.mby    = userId;
                    role_action.push(roleObj);
                })
                const insertRoleActionData = await insertModel('role_action', role_action);
                return callback( getResponse(200, updateData, 'UPDATE') )
            }else{
                return callback( getResponse() )
            }
        }
    } catch (err) {
        return callback( getResponse() )
    }
}

module.exports.deleteRoles = async (req, callback) => {
    try {
        const {id} = req.params;
        const {userId} = req.user;
        if(_isInt(id) ){
            const data = {
                status:2,
                dby:userId,
                ddate: currentDateTimeDbFormat()
            }
            let condition = { id: id };
            const deleteData = await updateModel(table,data,condition)
            if(deleteData.error){
                return callback( getResponse(409, {}, 'NOTEXIST: $[1],record') )
            }else{
                return callback( getResponse(200, deleteData, 'DELETED') )
            }
        }else{
            return callback( getResponse(400, {}, 'NOT_ALPHA: $[1],Module id') )
        }
    } catch (err) {
        return callback( getResponse() )
    }
}

module.exports.listRoles = async (req, callback) => {
    try {
        var listData = await rawQueryModel( `SELECT id,name ,description,status FROM role WHERE status = 0 AND cby_type != 'customer' AND cby_type IS NOT NULL` );
        console.log(listData)
        return callback( getResponse(200, listData, 'FETCHED') )
    } catch (err) {
        return callback( getResponse() )
    }
}

module.exports.customerAddedRoleList = async (req, callback) => {
    try {
        const { userId, type } = req.user;
        let data      = ['id','name ','description','module_id','status'];
        let condition = { status : 0, cby_type: type, cby:userId};
        let orderBy   = [{ column: 'id',order: 'desc' }];
        const listData = await fetchModel(table, data, condition, orderBy);
        return callback( getResponse(200, listData, 'FETCHED') )
    } catch (err) {
        return callback( getResponse() )
    }
}

module.exports.editRoles = async (req, callback) => {
    try {
        const { id } = req.params;
            const sql1 = `(SELECT role.id,role.name,role.description,role.module_id,role.status,CONCAT( '[', GROUP_CONCAT(JSON_OBJECT('id ', modules.id ,'page_name', modules.page_name,'status', modules.status)), ']' ) as module_name from role LEFT JOIN modules ON FIND_IN_SET( modules.id,role.module_id) WHERE role.status <> 2 AND role.id = '${id}' GROUP BY role.id )`;
            // const sql = `SELECT R.id,R.name,R.description,R.module_id,R.status, CONCAT( '[', GROUP_CONCAT(JSON_OBJECT('id', M.id ,'page_name', M.page_name,'status', M.status, 'add', RA.add, 'view', RA.view, 'edit', RA.edit, 'remove', RA.delete) ), ']' ) as module_name from role as R LEFT JOIN role_action as RA ON RA.role_id=R.id LEFT JOIN modules as M ON M.id = RA.module_id WHERE R.status <> 2 AND R.id = '2' GROUP BY R.id`
            // var editData = await rawQueryModel(sql);
            var editData = await Roles.editRoles(id);
        console.log('editData', editData)
        // editData.data = (editData.data && !_emptyArray(editData.data) ? editData.data[0] : {});
        return callback( getResponse(200, editData, 'FETCHED') )
    } catch (err) {
        return callback( getResponse() )
    }
}
const { _isInt, _isArray, currentDateTimeDbFormat } = require('./../utils/common')
const { insertModel, fetchModel, fetchOneModel, updateModel } = require('./../repositories/myModel-repository');
const {getResponse} = require('../utils/response');
const table = 'modules';

module.exports.createModules = async (req, callback) => {
    try {
        const { userId } = req.user;
        const { page_name } = req.body;
        if(_isArray(page_name)){
            var data = [];
            for (var val in page_name) {
                data.push({ page_name: page_name[val], cby:userId});
            }
        }else{
            var data = {
                page_name: page_name,
                cby:userId
            }
        }
        console.log(data)
        const insertData = await insertModel(table, data)
        if (insertData.error) {
            return callback( getResponse(400, {}, `CUSTOM_MSG: $[1],${insertData.sqlMessage}`) )
        } else {
            return callback( getResponse(200, insertData, 'INSERTED') )
        }
    } catch (err) {
        return callback( getResponse() )
    }
}

module.exports.updateModules = async (req, callback) => {
    try {
        const {userId} = req.user;
        const { id, page_name } = req.body;
        const data = {
            id: id,
            page_name: page_name,
            mby:userId,
            mdate: currentDateTimeDbFormat()
        }
        let condition = { 'and':{id: id}, 'not':{status:2} };
        const updateData = await updateModel( table, data, condition )
        if (updateData.error) {
            var errTrueMsg = (updateData.sqlMessage) ? `CUSTOM_MSG: $[1],${updateData.sqlMessage}` : 'NOTEXIST: $[1],module';
            // errTrueMsg = (sqlMsg)?custom Sql Msg:deleted record update (not exist)
            return callback( getResponse(400, {}, errTrueMsg) )
        } else {
            return callback( getResponse(200, updateData, 'UPDATE') )
        }
    } catch (err) {
        return callback( getResponse() )
    }
}

module.exports.deleteModules = async (req, callback) => {
    try {
        const {id} = req.params;
        const {userId} = req.user;
        if(id && id !== '' && _isInt(id) ){
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

module.exports.listModules = async (req, callback) => {
    try {
        let data      = ['id','page_name','status'];
        let condition = { status : 0 };
        let orderBy   = [{ column: 'id',order: 'desc' }];
        const listData = await fetchModel(table, data, condition, orderBy);
        return callback( getResponse(200, listData, 'FETCHED') )
    } catch (err) {
        return callback( getResponse() )
    }
}

module.exports.editModules = async (req, callback) => {
    try {
        const {id} = req.params;
        if(id && id !== '' && _isInt(id) ){
            let data = ['id','page_name'];
            let condition = { status:"0", id:id };
            const editData = await fetchOneModel(table, data, condition);
            return callback( getResponse(200, editData, 'FETCHED') )
        }else{
            return callback( getResponse(400, {}, 'NOT_ALPHA: $[1],Module id') )
        }
    } catch (err) {
        return callback( getResponse() )
    }
}
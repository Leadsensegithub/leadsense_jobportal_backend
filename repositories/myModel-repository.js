const config = require('../config/db-config');
const Knex = require('knex')

module.exports.insertModel = (table, data) => {
  /* 
  (multi insert) 
  data = [ { C1: 'V1', C2: 'V2', C3: 'V3' }, { C1: 'V1', C2: 'V2', C3: 'V3' }, { C1: 'V1', C2: 'V2', C3: 'V3' } ] 
  (single insert) 
  data = { C1: 'V1', C2: 'V2', C3: 'V3' }
    */
  try{
    const output = {}
    return new Promise(function (resolve) {
      const knex = new Knex(config)
      knex(table)
        .insert(data)
        .then(result => {
          if (result[0] && result[0] > 0) {
            output.error = false
            output.data = { insertId:result[0] }
          } else {
            output.error = true
          }
          resolve(output)
        })
        .catch((err) => {
          console.log(err)
          err.error = true
          resolve(err)
        })
        .finally(() => {
          knex.destroy()
        })
    })
  }catch(err){
    console.log(err)
  }
}

module.exports.updateModel = (table='', data='', condition='') => {
  // table     ="Table Name"
  // data      = { C1:'V1', C2:'V2', C3:'V3' }
  /* condition = {
            'and'         : { C1 : 0, C2 : 1},
            'not'         : { C1 : 2, C2 : 2}, 
            'In'          : { C1 : [1,2,3,4,5] },
            'notIn'       : { C1 : [1,2,3,4,5] },
            'between'     : { C1 : [1,2,3,4,5] },
            'notBetween'  : { C1 : [1,2,3,4,5] },
            'Null'        :  C1 (or) [ C1, C2, C3],
            'notNull'     :  C1 (or) [ C1, C2, C3],
            'orLike'      : { data: [C1,C2,C3], value:'%test%' },
            'andLike'     : { data: [C1,C2,C3], value:'%test%' }
          }  
  */ 
  // condition = {status:0,id:1} 
  var {and, not, In, notIn, Null, notNull, between, notBetween, orLike, andLike} = condition;
  and = (!and && !not && !In && !notIn && !Null && !notNull && !between && !notBetween && !orLike && !andLike) ? condition : (and && and != undefined) ? and : {}; 
  const output = {}
  return new Promise(function (resolve) {
    const knex = new Knex(config)
    knex(table)
      .update(data)
      .where((builder) => {
        if(and) builder.where(and);
        if(not) builder.whereNot(not);
        if(orLike){
          for(CName of orLike['data']){
            builder.orWhereILike( CName, orLike['value'] );
          }
        }
        if(andLike){
          for(CName of andLike['data']){
            builder.andWhereILike( CName, andLike['value'] );
          }
        }
        if(In){
          var column = Object.keys(In)[0];
          builder.whereIn(column, In[column]);
        }
        if(notIn){
          var column = Object.keys(notIn)[0];
          builder.whereNotIn(column, notIn[column]);
        }
        if(between){
          var CList = Object.keys(between);
          for(CName of CList){
            builder.whereBetween(CName, between[CName]);
          }
          }
        if(notBetween){
          var CList = Object.keys(notBetween);
          for(CName of CList){
            builder.whereNotBetween(CName, notBetween[CName]);
          }
          }
        if(Null){
          if(typeof Null === "object" && Array.isArray(Null) && Null !== null){
            for(CName of Null){
              builder.whereNull(CName);
            }
          }else{
            builder.whereNull(Null);
          }
        }
        if(notNull){
          if(typeof notNull === "object" && Array.isArray(notNull) && notNull !== null){
            for(CName of notNull){
              builder.whereNotNull(CName);
            }
          }else{
            builder.whereNull(Null);
          }
        }
      })
      .then(result => {
        if (result) {
          output.error = false
        } else {
          output.error = true
          output.data = result
        }
        resolve(output)
      })
      .catch((err) => {
        console.log(err)
        err.error = true
        resolve(err)
      })
      .finally(() => {
        knex.destroy()
      })
  })
}

module.exports.fetchModel = ( table='', data='', condition={}, orderBy=[], limit=25, offset=0 ) => {
  try{
  // table     ="Table Name"
  // data      = ['C1','C2','C3']
  /* condition = {
            'and'         : { C1 : 0, C2 : 1},
            'not'         : { C1 : 2, C2 : 2}, 
            'In'          : { C1 : [1,2,3,4,5] },
            'notIn'       : { C1 : [1,2,3,4,5] },
            'between'     : { C1 : [1,2,3,4,5] },
            'notBetween'  : { C1 : [1,2,3,4,5] },
            'Null'        :  C1 (or) [ C1, C2, C3],
            'notNull'     :  C1 (or) [ C1, C2, C3],
            'orLike'      : { data: [C1,C2,C3], value:'%test%' },
            'andLike'     : { data: [C1,C2,C3], value:'%test%' }
          }  
  */ 
  // condition = {status:0,id:1} 
  // orderBy   = [ { column: 'C1',order: 'desc' }, { column: 'C2', order: 'asc' } ]
  // limit     = 25
  // offset    = 25
  var {and, not, In, notIn, Null, notNull, between, notBetween, orLike, andLike} = condition;
  and = (!and && !not && !In && !notIn && !Null && !notNull && !between && !notBetween && !orLike && !andLike) ? condition : (and && and != undefined) ? and : {}; 
  const output = {}
  return new Promise(function (resolve) {
    const knex = new Knex(config)
    knex(table)
      .select(data)
      .where((builder) => {
        if(and) builder.where(and);
        if(not) builder.whereNot(not);
        if(orLike){
          for(CName of orLike['data']){
            builder.orWhereILike( CName, orLike['value'] );
          }
        }
        if(andLike){
          for(CName of andLike['data']){
            builder.andWhereILike( CName, andLike['value'] );
          }
        }
        if(In){
          var column = Object.keys(In)[0];
          builder.whereIn(column, In[column]);
        }
        if(notIn){
          var column = Object.keys(notIn)[0];
          builder.whereNotIn(column, notIn[column]);
        }
        if(between){
          var CList = Object.keys(between);
          for(CName of CList){
            builder.whereBetween(CName, between[CName]);
          }
          }
        if(notBetween){
          var CList = Object.keys(notBetween);
          for(CName of CList){
            builder.whereNotBetween(CName, notBetween[CName]);
          }
          }
        if(Null){
          if(typeof Null === "object" && Array.isArray(Null) && Null !== null){
            for(CName of Null){
              builder.whereNull(CName);
            }
          }else{
            builder.whereNull(Null);
          }
        }
        if(notNull){
          if(typeof notNull === "object" && Array.isArray(notNull) && notNull !== null){
            for(CName of notNull){
              builder.whereNotNull(CName);
            }
          }else{
            builder.whereNull(Null);
          }
        }
      })
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .then(result => {
          output.error = false
          output.data = result
        resolve(output)
      })
      .catch((err) => {
        console.log(err)
        err.error = true
        resolve(err)
      })
      .finally(() => {
        knex.destroy()
      })
    })
  }catch(err){
    console.log(err)
  }
}

module.exports.rawQueryModel = ( sql='') => {
  try{
  const output = {}
  return new Promise(function (resolve) {
    const knex = new Knex(config)
    knex.raw(sql)
      .then(result => {
        if (result.length > 0) {
          output.error = false
          output.data = result[0]
        } else {
          output.error = false
          output.data = {}
        }
        resolve(output)
      })
      .catch((err) => {
        console.log(err)
        err.error = true
        resolve(err)
      })
      .finally(() => {
        knex.destroy()
      })
    })
  }catch(err){
    console.log(err)
  }
}

module.exports.deleteModel = ( table='', condition={}) => {
  // condition = { id:5 } => 5th record only delete
  // condition = {} => All record delete in table
  try{
  const output = {}
  return new Promise(function (resolve) {
    const knex = new Knex(config)
    knex(table)
      .del()
      .where(condition)
      .then(result => {
        output.error = false
        output.data = result
        resolve(output)
      })
      .catch((err) => {
        console.log(err)
        err.error = true
        resolve(err)
      })
      .finally(() => {
        knex.destroy()
      })
    })
  }catch(err){
    console.log(err)
  }
}

module.exports.fetchOneModel = ( table='', data='', condition={} ) => {
  try{
  // table="Table Name"
  // data = ['C1','C2','C3']
  /* condition = {
            'and'         : { C1 : 0, C2 : 1},
            'not'         : { C1 : 2, C2 : 2}, 
            'In'          : { C1 : [1,2,3,4,5] },
            'notIn'       : { C1 : [1,2,3,4,5] },
            'between'     : { C1 : [1,2,3,4,5] },
            'notBetween'  : { C1 : [1,2,3,4,5] },
            'Null'        :  C1 (or) [ C1, C2, C3],
            'notNull'     :  C1 (or) [ C1, C2, C3],
            'orLike'      : { data: [C1,C2,C3], value:'%test%' },
            'andLike'     : { data: [C1,C2,C3], value:'%test%' }
          }  
  */ 
  // condition = {status:0,id:1} 
  var {and, not, In, notIn, Null, notNull, between, notBetween, orLike, andLike} = condition;
  and = (!and && !not && !In && !notIn && !Null && !notNull && !between && !notBetween && !orLike && !andLike) ? condition : (and && and != undefined) ? and : {}; 
  const output = {}
  return new Promise(function (resolve) {
    const knex = new Knex(config)
    knex(table)
      .select(data)
      .where((builder) => {
        if(and) builder.where(and);
        if(not) builder.whereNot(not);
        if(orLike){
          for(CName of orLike['data']){
            builder.orWhereILike( CName, orLike['value'] );
          }
        }
        if(andLike){
          for(CName of andLike['data']){
            builder.andWhereILike( CName, andLike['value'] );
          }
        }
        if(In){
          var column = Object.keys(In)[0];
          builder.whereIn(column, In[column]);
        }
        if(notIn){
          var column = Object.keys(notIn)[0];
          builder.whereNotIn(column, notIn[column]);
        }
        if(between){
          var CList = Object.keys(between);
          for(CName of CList){
            builder.whereBetween(CName, between[CName]);
          }
          }
        if(notBetween){
          var CList = Object.keys(notBetween);
          for(CName of CList){
            builder.whereNotBetween(CName, notBetween[CName]);
          }
          }
        if(Null){
          if(typeof Null === "object" && Array.isArray(Null) && Null !== null){
            for(CName of Null){
              builder.whereNull(CName);
            }
          }else{
            builder.whereNull(Null);
          }
        }
        if(notNull){
          if(typeof notNull === "object" && Array.isArray(notNull) && notNull !== null){
            for(CName of notNull){
              builder.whereNotNull(CName);
            }
          }else{
            builder.whereNull(Null);
          }
        }
      })
      .then(result => {
        if (result.length > 0) {
          output.error = false
          output.data = result[0]
        } else {
          output.error = false
          output.data = {}
        }
        resolve(output)
      })
      .catch((err) => {
        console.log(err)
        err.error = true
        resolve(err)
      })
      .finally(() => {
        knex.destroy()
      })
    })
  }catch(err){
    console.log(err)
  }
}

module.exports.countModel = ( table='', condition={} ) => {
  try{
  // table="Table Name"
  /* condition = {
            'and'         : { C1 : 0, C2 : 1},
            'not'         : { C1 : 2, C2 : 2}, 
            'In'          : { C1 : [1,2,3,4,5] },
            'notIn'       : { C1 : [1,2,3,4,5] },
            'between'     : { C1 : [1,2] } (or) { C1 : [1,2], C2 : [1,2], C3 : [1,2] },
            'notBetween'  : { C1 : [1,2] } (or) { C1 : [1,2], C2 : [1,2], C3 : [1,2] },
            'Null'        :  C1 (or) [ C1, C2, C3],
            'notNull'     :  C1 (or) [ C1, C2, C3],
            'orLike'      : { data: [C1,C2,C3], value:'%test%' },
            'andLike'     : { data: [C1,C2,C3], value:'%test%' }
          }  
  */ 
  // condition = {status:0,id:1} 
    var {and, not, In, notIn, Null, notNull, between, notBetween, orLike, andLike} = condition;
    and = (!and && !not && !In && !notIn && !Null && !notNull && !between && !notBetween && !orLike && !andLike) ? condition : (and && and != undefined) ? and : {}; 
    const output = {}
    return new Promise(function (resolve) {
      const knex = new Knex(config)
      knex(table)
        .count('* as count')
        .where((builder) => {
          if(and) builder.where(and);
          if(not) builder.whereNot(not);
          if(orLike){
            for(CName of orLike['data']){
              builder.orWhereILike( CName, orLike['value'] );
            }
          }
          if(andLike){
            for(CName of andLike['data']){
              builder.andWhereILike( CName, andLike['value'] );
            }
          }
          if(In){
            var column = Object.keys(In)[0];
            builder.whereIn(column, In[column]);
          }
          if(notIn){
            var column = Object.keys(notIn)[0];
            builder.whereNotIn(column, notIn[column]);
          }
          if(between){
            var CList = Object.keys(between);
            for(CName of CList){
              builder.whereBetween(CName, between[CName]);
            }
            }
          if(notBetween){
            var CList = Object.keys(notBetween);
            for(CName of CList){
              builder.whereNotBetween(CName, notBetween[CName]);
            }
            }
          if(Null){
            if(typeof Null === "object" && Array.isArray(Null) && Null !== null){
              for(CName of Null){
                builder.whereNull(CName);
              }
            }else{
              builder.whereNull(Null);
            }
          }
          if(notNull){
            if(typeof notNull === "object" && Array.isArray(notNull) && notNull !== null){
              for(CName of notNull){
                builder.whereNotNull(CName);
              }
            }else{
              builder.whereNull(Null);
            }
          }
        })
      .then(result => {
        if (result.length > 0) {
          output.error = false
          output.data = result[0]
        } else {
          output.error = false
          output.data = {}
        }
        resolve(output)
      })
      .catch((err) => {
        console.log(err)
        err.error = true
        resolve(err)
      })
      .finally(() => {
        knex.destroy()
      })
    })
  }catch(err){
    console.log(err)
  }
}

const mysql = require('sync-mysql');
var db_info = {
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'autoinven',
};

module.exports = {
    init : function(){
	    var connection = new mysql(db_info);
	    return connection;
    },
	info : db_info
}

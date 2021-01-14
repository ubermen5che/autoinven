const mysql = require('sync-mysql');

var db_info = {
    host : process.env.MYSQL_HOST_IP, //docker mysql container의 ip주소로 변경해주어야함.
    user : 'user',
    port : 3306,
    password : 'password',
    database : 'autoinven',
};

module.exports = {
    init : function(){
	    var connection = new mysql(db_info);
	    return connection;
    },
	info : db_info
}

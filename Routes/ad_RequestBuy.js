exports.RequestForBuy = function (req, res,app,db) {
  var items="{";
  var sql = `select * from RequestForBuy, Warehouse where Warehouse.warehouseID=RequestForBuy.warehouseID`;
  let results = db.query(sql);
  console.log(results);
  if(results.length > 0) {
      var step;
      for(step =0;step<results.length;step++){
          items+= ("\"item"+step+"\":");
          var obj="{"+
              "\"reqID\" :"+ results[step].reqID+","+
              "\"reqDate\" :\""+ results[step].reqDate+"\","+
              "\"reqType\" :\"" + results[step].reqType+"\","+
              "\"warehouseID\" :"+ results[step].warehouseID +","+
              "\"buyerID\" :\""+ results[step].buyerID+"\","+
              "\"amounts\" :\""+ (results[step].price * results[step].area)+"\","+
              "\"startDate\" :\""+ results[step].startDate.substring(0,10) +"\","+
              "\"endDate\" :\""+ results[step].endDate.substring(0,10) +"\","+
              "\"area\" :"+ results[step].area+
          "}";
          items+=obj;
          if(step+1<results.length)items+=","
      }
  }
  items +="}";
  return items;
}

exports.withAnswer = function(req,res,app,db){
  var reqID = req.body.reqID;
  var reqType = req.body.reqType;
  var answer = req.body.answer;
  var mysql = require('mysql');
  var connection = mysql.createConnection(require('../Module/db').info);
  connection.connect();
  if(answer=="Approve"){
    if(reqType=="ReqByBuyer"){
      connection.query(`UPDATE RequestForBuy SET reqType='ReqByAdmin' WHERE reqID=?`,[reqID],function (error, results, fields) {
        if(error){res.send(false);connection.end()}
        else{
          res.send(true);
          connection.end();
        }
      });
    }
  }
  else if(answer=="Reject"){
    connection.query(`UPDATE RequestForBuy SET reqType='RejByAdmin' WHERE reqID =?`,[reqID],function (error, results, fields) {
      if(error){res.send(false);connection.end()}
      else{
        res.send(true);
        connection.end();
      }
    });
  }
}
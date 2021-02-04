exports.RequestForEnroll = function (req, res,app,db) {
  var items="{";
  let results = db.query('select * from RequestForEnroll, Member, Warehouse where RequestForEnroll.providerID=Member.memberID and RequestForEnroll.warehouseID=Warehouse.warehouseID');
  console.log(results);
  if(results.length > 0) {
      var step;
      for(step =0;step<results.length;step++){
          items+= ("\"item"+step+"\":");
          var obj="{"+
              "\"reqID\" :"+ results[step].reqID+","+
              "\"reqDate\" :\""+ results[step].reqDate+"\","+
              "\"reqType\" :\"" + results[step].reqType+"\","+
              "\"warehouseID\" :"+ results[step].warehouseID+","+
              "\"providerID\" :\""+ results[step].providerID+"\","+
              "\"national\" :\""+ results[step].national +"\","+
              "\"CA\" :\""+ results[step].CA +"\","+
              "\"CN\" :\""+ results[step].CN +"\","+
              "\"CCN\" :\""+ results[step].CCN +"\","+
              "\"address\" :\""+ results[step].address +"\","+
              "\"name\" :\""+ results[step].name +"\","+
              "\"floorArea\" :"+ results[step].floorArea+
          "}";
          items+=obj;
          if(step+1<results.length)items+=","
      }
  }
  items +="}";
  return items;
}

exports.withAnswer = function(req,res,app,db){
  var providerID = req.body.providerID;
  var reqID = req.body.reqID;
  var warehouseID = req.body.warehouseID;
  var reqType = req.body.reqType;
  var answer = req.body.answer;
  var mysql = require('mysql');
  var connection = mysql.createConnection(require('../Module/db').info);
  connection.connect();
  console.log('reqbody :' + req.body);
  if(answer=="Approve"){
      if(reqType=="ReqEnrollPV"){
        let reqResult = db.query('SELECT * from Provider');
        var psID = reqResult.length+1;
        var info={
          "memberID": providerID,
          "warehouseID": req.body.warehouseID,
        };
        connection.query('INSERT INTO Provider SET ?',info,function (error, results, fields) {
          if(error){
            console.log(error);
            res.send(false);
            connection.end();
          }
          else{
            connection.query("DELETE FROM RequestForEnroll WHERE reqID ="+reqID,function (error, results, fields) {
              if(error){console.log('Error at Delete from RQFEnroll');res.send(false);connection.end();}
              else{
                connection.query('INSERT INTO EnrolledWarehouse SET ?',{'warehouseID':info.warehouseID,'logID':11111111},function (error, results, fields) {
                  if(error){console.log('Error at Insert EnrollWarehouse' + error);res.send(false);connection.end();}
                  else{
                    res.send(true);
                    connection.end();
                  }
                });
              }
            });
          }
        });
      }
    }
    else if(answer=="Reject"){
      connection.query(`UPDATE RequestForEnroll SET reqType='ReqRejectPV' WHERE reqID =?`,[reqID],function (error, results, fields) {
      if(error){res.send(false);connection.end();}
      else{
        connection.query(`DELETE FROM Warehouse WHERE warehouseID =${warehouseID}`,function (error, results, fields) {
          if(error){
            res.send(false);
            console.log(error);
            connection.end();
          }
          else{
            res.send(true);
            connection.end();
          }
        });
      }
    });
  }
}
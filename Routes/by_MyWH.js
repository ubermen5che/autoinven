exports.RequestForBuy = function (req, res,app,db) {
  var items="{";
  var sql = `select * from RequestForBuy, Warehouse where Warehouse.warehouseID=RequestForBuy.warehouseID and buyerID='`+req.session['memberID']+"'";
  let results = db.query(sql);
  if(results.length > 0) {
      var step;
      for(step =0;step<results.length;step++){
          results[step].price = results[step].price * results[step].area;
          items+= ("\"item"+step+"\":");
          var obj="{"+
              "\"reqID\" :"+ results[step].reqID+","+
              "\"reqDate\" :\""+ results[step].reqDate+"\","+
              "\"reqType\" :\"" + results[step].reqType+"\","+
              "\"warehouseID\" :"+ results[step].warehouseID +","+
              "\"buyerID\" :\""+ results[step].buyerID+"\","+
              "\"area\" :"+ results[step].area+","+
              "\"amounts\" :"+ results[step].price+","+
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


exports.Mywarehouse = function(req,res,app,db){
  var items="{";
  let sql = `SELECT * from Warehouse,Buyer where Warehouse.warehouseID=Buyer.warehouseID and Buyer.memberID=\'${req.session['memberID']}\'`;
  let results = db.query(sql);
  if(results.length > 0) {
      var step;
      for(step =0;step<results.length;step++){
          items+= ("\"item"+step+"\":");
          sql = `SELECT DISTINCT memberID from Provider where warehouseID=${results[step].warehouseID}`;
          let idList = db.query(sql);
          var obj="{"+
              "\"warehouseID\" :"+ results[step].warehouseID+","+
              "\"warehouseName\" :\""+ results[step].warehouseName+"\","+
              "\"providerID\":\""+idList[0].memberID+"\","+
              "\"enrolledDate\" :\"" + results[step].enrolledDate+"\","+
              "\"address\" :\""+ results[step].address+"\","+
              "\"latitude\" :"+ results[step].latitude+","+
              "\"longitude\" :"+ results[step].longitude+","+
              "\"landArea\" :"+ results[step].landArea +","+
              "\"floorArea\" :"+ results[step].floorArea +","+
              "\"useableArea\" :"+ results[step].useableArea +","+
              "\"price\" :"+ results[step].price +","+
              "\"area\":" +results[step].area+","+
              "\"infoComment\" :\""+ results[step].infoComment+"\","+
              "\"etcComment\" :\""+ results[step].etcComment+"\""+
          "}";
          items+=obj;

          if(step+1<results.length)items+=","
      }
  }
  items +="}";
//  console.log(items);
  return items;
}

exports.ReqBuyWithAnswer = function(req,res,app,db){
  var reqID = req.body.reqID;
  var reqType = req.body.reqType;
  var answer = req.body.answer;
  var mysql = require('mysql');
  var connection = mysql.createConnection(require('../Module/db').info);
  const nodePickle = require('pickle');
  connection.connect();
  if(answer=="Cancel"){
      connection.query(`UPDATE RequestForBuy SET reqType='RejByBuyer' WHERE reqID =${reqID}`,function (error, results, fields){
        if(error){res.send(false);connection.end()}
        else{
          res.send(true);
          connection.end();
        }
      });
  }
  else if(answer=="Confirm"){
    if(reqType=="RejByAd"||reqType=="RejByPv"){
      connection.query(`DELETE FROM RequestForBuy WHERE reqID =${reqID}`,function (error, results, fields) {
        if(error){res.send(false);connection.end()}
        else{
          res.send(true);
          connection.end();
        }
    });
    }
  }
  else if(answer=="Accept"){
    if(reqType=="ReqPayByBuyer"){
      var sql = `SELECT price FROM Warehouse WHERE warehouseID='`+req.body.whID+"'";
      let price = db.query(sql);
//      console.log(price[0].price);
      connection.query(`UPDATE RequestForBuy SET reqType='ReqPayAcpt' WHERE reqID =${reqID}`,function (error, results, fields) {
          if(error){
            console.log(error);
            res.send(false);
            connection.end();
          }
          else{
            var info = {
              reqID: req.body.reqID,
              memberID: req.session['memberID'],
              warehouseID: req.body.whID,
              area: req.body.area
            };
            connection.query(`UPDATE Warehouse SET useableArea=useableArea-${info.area} WHERE warehouseID=${info.warehouseID}`);
            connection.query(`INSERT INTO Buyer SET ?`,info,function (error, results, fields) {
                if(error){
                  console.log(error);
                  res.send(false);
                  connection.end()
                }
                else{
                  let result = db.query('select * from Contract ORDER BY contractID DESC');
                  var conno = 1;
                  if(result.length>0)
                   conno = result[0].contractID+1;                  //2020-12-29  거래ID 동적 처리.
                  var contract = {
                      contractID : conno,
                      buyerID : info['memberID'],
                      warehouseID : info['warehouseID'],
                      startDate : req.body.startDate,
                      endDate : req.body.endDate,
                      area : info['area'],
                      price : price[0].price * info['area'],                                    //추후 변경필요, 현재 8로 고정된 가격만 가능. -2020-12-19- 수정완료
                      logID : 1
                  };
                  connection.query(`INSERT INTO Contract SET ?`,contract,function (error, results, fields) {
                    if(error){
                      console.log(error);
                      res.send(false);
                      connection.end()
                    }
                    /*
                    else{
                            var sock = require('../Module/bcsocket').socket;
                            var dic = {
                                'MSGTYPE':'RECORD',
                                'ID':'WEBSERVER',
                                'data':{
                                    'timestamp':new Date(),
                                    'transaction':`${contract.buyerID} pay ${contract.price} for warehouseID(${contract.warehouseID})`
                                  }
                            }
                            nodePickle.dumps(dic,function(pickled){
                                  sock.write(pickled)
                            })
                            res.send(true);
                            connection.end();
                    }
                    */
                   else{
                     console.log('주문이 정상적으로 처리되었습니다.');
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
}

exports.GetAmountsForItems = function(req,res,app,db){
  
}

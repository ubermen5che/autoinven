exports.showContarctInfo = function (req, res,app,db) {
    var items="{";
    var sql = `select * from Contract, Member where Contract.buyerID=Member.memberID`;
    let results = db.query(sql);
    console.log(results);
    if(results.length > 0) {
        var step;
        for(step =0;step<results.length;step++){
            items+= ("\"item"+step+"\":");
            var obj="{"+
                "\"contractID\" :"+ results[step].contractID+","+
                "\"buyerID\" :\""+ results[step].buyerID+"\","+
                "\"warehouseID\" :"+ results[step].warehouseID +","+
                "\"amounts\" :\""+ results[step].price+"\","+
                "\"startDate\" :\""+ results[step].startDate.substring(0,10) +"\","+
                "\"endDate\" :\""+ results[step].endDate.substring(0,10) +"\","+
                "\"national\" :\""+ results[step].national +"\","+
                "\"contractNumber\" :\""+ results[step].contractNumber +"\","+
                "\"CA\" :\""+ results[step].CA +"\","+
                "\"CN\" :\""+ results[step].CN +"\","+
                "\"CCN\" :\""+ results[step].CCN +"\","+
                "\"address\" :\""+ results[step].address +"\","+
                "\"email\" :\""+ results[step].email +"\","+
                "\"name\" :\""+ results[step].name +"\","+
                "\"area\" :"+ results[step].area+
            "}";
            items+=obj;
            if(step+1<results.length)items+=","
        }
    }
    items +="}";
    return items;
  }
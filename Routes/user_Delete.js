exports.delete = function (req, res,app,db) {

    var memberID = req.session.memberID;
    var memberType = req.session.type;
    var name = req.session.name;
    var email = req.session.email;
    var contactNumber = req.session.contactNumber;
    var address = req.session.address;
    var national = req.session.national;
    var CN = req.session.CN;
    var CA = req.session.CA;
    var CCN = req.session.CCN;
    var deletedDate = new Date();

    console.log('user_Delete: ' + req.body.memberID);
    console.log('user_Delete: ' + req.body.session.memberID);
    var insertSQL = `INSERT INTO Deletedmember SET memberID=?, type=?, password=?, email=?, contactNumber=?, address=?, nationa=?, CN=?, CA=?,
    CCN=?, DeletedDate=?`;

    var deleteSQL = `DELETE FROM Member WHERE memberID='${req.session.memberID}'`;
    
    var check = db.query(insertSQL,[memberID,memberType,name,email,contactNumber,address,national,CN,CA,CCN,deletedDate]);

    if (!check) {
        console.log("insertSQL : error ocurred", error);
        res.redirect('/User/Edit');
    } else {
        var deletionCheck = db.query(deleteSQL);

        if(!deletionCheck){
            console.log("deleteSQL : error ocurred", error);
        }
        else{
            req.session.destroy();
            res.redirect('/');
        }
    }
}
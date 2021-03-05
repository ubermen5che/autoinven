exports.login = function (req, res,app,db) {
    const crypto = require('crypto');
    console.log('req.body.memberID :' + req.body.memberID);
    console.log('req.body.password :' + req.body.password);
    var memberID = req.body.memberID;
    var password = req.body.password;
    let results = db.query('SELECT * FROM Member WHERE memberID = ?', [memberID]);
    //console.log(results[0].password);
    console.log(crypto.createHash('sha512').update(password).digest('base64'));
    if(results.length > 0) {
        if(results[0].password == crypto.createHash('sha512').update(password).digest('base64')) {
            console.log('match password');
            req.session['memberID'] = results[0].memberID;
            req.session['type'] =  results[0].type;
            req.session['username'] = results[0].name;
            req.session['password'] = results[0].password;
            req.session['RN'] = results[0].RN;
            req.session['email'] = results[0].email;
            req.session['contactNumber'] = results[0].contactNumber;
            req.session['address'] = results[0].address;
            req.session['national'] = results[0].national;
            req.session['CN'] = results[0].CN;
            req.session['CA'] = results[0].CA;
            req.session['CCN'] = results[0].CCN;
            res.send('loginSuccess');
        } else {
            res.send('loginError02'); //PW가 틀릴 시
        }
    } else {
        res.send('loginError01'); //DB에 해당하는 ID가 없을 시
    }
}
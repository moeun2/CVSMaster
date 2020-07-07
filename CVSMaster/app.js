var express = require('express');
var http = require('http');
var path = require('path');
var static = require('serve-static');
var mysql = require('mysql');
var app = express(); 
var bodyParser = require('body-parser');

var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '0000',
    database: 'cs'
});



app.use(static(path.join(__dirname,'/')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('port',process.env.PORT || 8080);

app.get('/',function(req, res){ 
    res.send('index.html');      
})




/*app.get('/db',function(req,res){
    
    cnt++;
    if(cnt%2==0)
        medicine=false;
    else 
        medicine = true;

    console.log(cnt, medicine);
    connection.connect();
    
    connection.query('select * from cs_info where atm = atm and medicine=medicine', function (error, results, fields) {        
        if(error){
            console.log(error);
            console.log("쿼리문에 오류가 있습니다.");
        }
        res.send(results);
    });
    
    
})*/

connection.connect();

app.post('/db',function(req,res){    
    console.log("현재위치 : " + req.body.location.gu);
    console.log("서비스 : " + req.body.services);

    var where = new Array();
    var length  = req.body.services.length;

    for (var i=0; i<length ;i++)
    {
        var service = req.body.services[i];
        where.push(service +'= true');
    }

    var sql= 'select * from cs_info ';
    for(var i=0;i<where.length;i++)
    {
        if(i==0)
        {
            sql += 'where ' + where[i];
        }
        else{
            sql +=  ' and ' + where[i];
        }
    }
    
    console.log(sql);

    connection.query(sql, function (error, results, fields) {        
        if(error){
            console.log(error);
            console.log("쿼리문에 오류가 있습니다.");
        }
        console.log(results);
        res.send(results);
    });

    // index = req.body.indexObject;
    // check = req.body.checkObject;

    // category[index-1] = check;
    // if (check== false)
    // {
    //     operator[index-1] = "or";
    // }

    // console.log(category[index-1]);
    
    // var sql = 'select * from cs_info where atm = '+ category[0]
    // + ' and parcel = '+ category[1]
    // + ' or bakery = '+ category[2]
    // + ' or friedfood = '+ category[3]
    // + ' or cafe = '+ category[4]
    // + ' or lotto = '+ category[5]
    // + ' or sportstoto = '+ category[6]
    // + ' or medicine = '+ category[7];

    // connection.query(sql, function (error, results, fields) {        
    //     if(error){
    //         console.log(error);
    //         console.log("쿼리문에 오류가 있습니다.");
    //     }
    //     res.send(results);
    // });    
})

http.createServer(app).listen(app.get('port'),function(){
    console.log('Server START...' + app.get('port'));
})
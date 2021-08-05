var mysql = require('mysql');
const csv = require('csv-parser');
var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');
var express = require('express')
var fs = require('fs')
var app = express()
var path = require('path');


var bodyParser = require('body-parser');

// Used to delay while awaiting animation to finish
function sleep(ms) {
    return new Promise((resolve) => {
        console.log("Waiting " + ms + " milliseconds...");
        setTimeout(resolve, ms);
    });
}
app.use(bodyParser.urlencoded({
    extended: false
}));

var con = mysql.createConnection({
    
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));



app.post('/order', async function (req, res) {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    // current hours
    let hours = date_ob.getHours();
    // current minutes
    let minutes = date_ob.getMinutes();
    // current seconds
    let seconds = date_ob.getSeconds();
    var jsonObject = JSON.stringify(req.body);
    // console.log(jsonObject)

    // console.log('Order Recieved')
    // let time = hours + ":" + minutes + ":" + seconds + "  " + date + "-" + month + "-" + year
    // console.log(hours + ":" + minutes + ":" + seconds + "  " + date + "-" + month + "-" + year);
    // console.log(typeof req.body.filling)

    let dish = "";
    if (req.body.DishNoodle != "Select Option") {
        dish = req.body.DishNoodle
    }
    if (req.body.DishCurry != "Select Option") {
        dish = req.body.DishCurry
    }
    if (req.body.DishStirfry != "Select Option") {
        dish = req.body.DishStirfry
    }
    let spicy = "";
    if (req.body.spicy != null) {
        spicy = 'Spicy'
    }
    let meat = "";
    if (req.body.meat != null) {
        meat = 'Extra Meat'
    }
    // console.log('meat:' + meat);


    // console.log('Dish: ' + dish);

    // Calculate Price
    let price = 0;
    if (req.body.meat != null) {
        price = price + 2;

    }
    if (req.body.filling == 'Vegetable' || req.body.filling == 'Chicken' || req.body.filling == 'Beef') {
        price = price + 10;
    }
    if (req.body.filling == 'Combination' || req.body.filling == 'BBQ Pork' || req.body.filling == 'Crispy Pork') {
        price = price + 13;
    }
    if (req.body.filling == 'Duck' || req.body.filling == 'Prawns' || req.body.filling == 'Seafood') {
        price = price + 15;
    }

    // console.log('Price is : ' + price);

    let order = {
        name: req.body.name,
        filling: req.body.filling,
        dishType: req.body.dishType,
        dish: dish,
        drink: req.body.drink,
        requirements: spicy + ', ' + meat + ', ' + req.body.message,
        orderDate: date_ob,
        paid: 'n',
        price: price
    }
    var query = "INSERT INTO orders SET ?";

    con.query(query, order, function (err, result) {
        if (err) throw err;
        // console.log("1 record inserted");
    });

    //res.query = 'test';


    var string = '?price=' + price;

    await sleep(1000);

    res.redirect('/OrderPlaced.html' + string);
    // console.log(string);
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/list', function (req, res) {
    var query = "SELECT * FROM orders"
    con.query(query, function (err, result) {
        if (err) throw err;
        // console.log(typeof result);
        // console.log("Record produced");
        //var myJSON = JSON.stringify(result);
        res.send(result);
    });


});
app.get('/pendingpayments', function (req, res) {
    var query = "SELECT * FROM orders WHERE paid = 'n'"
    con.query(query, function (err, result) {
        if (err) throw err;
        // console.log(result);
        // console.log("Record produced");
        var myJSON = JSON.stringify(result);
        res.send(result);
    });


});

app.post('/updatePayments', function (req, res) {
    console.log(req.body)

    var query = "UPDATE orders SET paid = 'y' WHERE idorders =" + req.body.idorders
    con.query(query, function (err, result) {
        if (err) throw err;
    });

});

app.listen(8080, function () {
    console.log('Server running on 8080...');
});

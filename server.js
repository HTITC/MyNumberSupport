var express = require('express'),
    app = express();

app.use(express.static(__dirname + '/public'));

// set up handlebars view engine
var handlebars = require('express-handlebars')
    .create({
        defaultLayout:'main',
        extname: 'hbs',
        //layoutsDir="views/layouts/"
    });
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');


app.get('/', function (req, res) {
    res.render('home');
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});

var express = require('express'),
    app = express();

app.use(express.static(__dirname + '/public'));

// set up handlebars view engine
var handlebars = require('express-handlebars')
    .create({
        defaultLayout:'main',
        extname: 'hbs',
        //layoutsDir="views/layouts/",
        helpers: {
            section: function(name, options){
                if(!this._sections) this._sections = {};
                this._sections[name] = options.fn(this);
                return null;
            }
        }
    });
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

app.get('/', function (req, res) {
    res.render('login');
});

app.get('/support', function (req, res) {
    res.render('support');
});

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
    res.status(404);
    res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});

var express = require('express'),
    app = express();

app.use(express.static(__dirname + '/public'));

var credentials = require('./credentials.js');

//var db = require('./lib/persistence').sqlite3;
//db.createUsersTable();
//db.createSampleUsers();

// cookie settings
//app.use(require('cookie-parser')(credentials.secretKey));

// session settings; use of cookie-parser not necessary
// see: https://github.com/expressjs/session#options
// see: http://stackoverflow.com/questions/27961320/when-should-i-use-cookie-parser-with-express-session
app.use(require('express-session')({
    // cookie: Settings for the session ID cookie.
            // See the "Cookie options" section for more information on the different values.
            // The default value is { path: '/', httpOnly: true, secure: false, maxAge: null }.
    // genid: Function to call to generate a new session ID; default function uses uid2 library.
    // name: The name of the session ID cookie; default is 'connect.sid'.
    resave: false, // Forces the session to be saved back to the session store,
                   // even if the session was never modified during the request.
                   // Check with your store if it implements the touch method.
                   // If it does, then you can safely set resave: false.
                   // If it does not implement the touch method and your store sets an expiration date
                   // on stored sessions, then you likely need resave: true.
    // rolling: Force a cookie to be set on every response.
             // This resets the expiration date. The default value is false.
    saveUninitialized: false, // Forces a session that is "uninitialized" to be
                              // saved to the store. A session is uninitialized when
                              // it is new but not modified. Choosing false is useful
                              // for implementing login sessions, reducing
                              // server storage usage, or complying with laws
                              // that require permission before setting a cookie.
    secret: credentials.secretKey,
    // store: The session store instance, defaults to a new MemoryStore instance.
    // unset: Control the result of unsetting req.session (through delete, setting to null, etc.).
          // 'keep' (default), The session in the store will be kept, but modifications
          // made during the request are ignored and not saved.
          // 'destroy' The session will be destroyed (deleted) when the response ends.
}));

// set up handlebars view engine
var handlebars = require('express-handlebars')
    .create({
        defaultLayout:'main',
        extname: 'hbs',
        //layoutsDir="views/layouts/",
        // See: http://stackoverflow.com/questions/21737057/handlebars-with-express-different-html-head-for-different-pages
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

var bodyParser = require('body-parser');
//app.use(bodyParser());
//See: http://stackoverflow.com/questions/24330014/bodyparser-is-deprecated-express-4
app.use(bodyParser.urlencoded({extended: true}));

// Cross-Site Request Forgery prevention
app.use(require('csurf')());
app.use(function(req, res, next){
    res.locals._csrfToken = req.csrfToken();
    // res.locals object is part of the context that will be passed to views
    next();
});

// Get session parameters
app.use(function(req, res, next){
    res.locals.flash = req.session.flash;
    delete req.session.flash;

    res.locals.username = req.session.username;
    delete req.session.username;

    next();
});
//------------------------------------------------------------------------------

app.get('/', function(req, res) {
    // res.render('login', { csrfToken: req.csrfToken() });
    res.render('login'); // use res.locals._csrfToken; see above CSRF prevenetion settings
});

app.post('/', function(req, res) {
    console.log('Form (from querystring): ' + req.query.form);
    console.log('CSRF token (from hidden form field): ' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.username);
    console.log('Password (from visible form field): ' + req.body.password);

    var username = req.body.username,
        password = req.body.password;

        /*require('./lib/persistence').pg.getUser(username, function(user) {
            if (user) {
                if (user.password === password) {
                    req.session.flash = {
                        type: 'success',
                        message: 'You are logged on now!',
                    };
                    req.session.loggedOn = true;
                    res.redirect(303, '/support');
                } else {
                    req.session.flash = {
                        type: 'error',
                        message: 'Username or password incorrect.',
                    };
                    req.session.username = username;
                    res.redirect(303, '/');
                }
            } else {
                req.session.flash = {
                    type: 'error',
                    message: 'Username or password incorrect.',
                };
                req.session.username = username;
                res.redirect(303, '/');
            }
        });*/

        require('./lib/persistence').sqlite3.getUser(username, function(user) {
            if (user) {
                if (user.password === password) {
                    req.session.flash = {
                        type: 'success',
                        message: 'You are logged on now!',
                    };
                    req.session.loggedOn = true;
                    res.redirect(303, '/support');
                } else {
                    req.session.flash = {
                        type: 'error',
                        message: 'Username or password incorrect.',
                    };
                    req.session.username = username;
                    res.redirect(303, '/');
                }
            } else {
                req.session.flash = {
                    type: 'error',
                    message: 'Username or password incorrect.',
                };
                req.session.username = username;
                res.redirect(303, '/');
            }
        });

    /*var found = credentials.users.some(function(u){
        return (u.username === username && u.password === password);
    });

    if (found) {
        req.session.flash = {
            type: 'success',
            message: 'You are logged on now!',
        };
        req.session.loggedOn = true;
        res.redirect(303, '/support');
    } else {
        req.session.flash = {
            type: 'error',
            message: 'Username or password incorrect.',
        };
        req.session.username = username;
        res.redirect(303, '/');
    }*/
})

app.get('/support', function(req, res) {
    if (req.session.loggedOn) {
        res.render('support');
    } else {
        req.session.flash = {
            type: 'error',
            message: 'Please log on to the site.',
        };
        res.redirect(303, '/');
    }
});

app.get('/logout', function(req, res) {
    if (req.session.loggedOn) {
        delete req.session.loggedOn;
    }
    res.redirect(303, '/');
});

//------------------------------------------------------------------------------

// 500 error handler (middleware)
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
    res.status(404);
    res.render('404');
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});

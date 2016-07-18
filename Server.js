var express = require("express"),
    mysql = require("mysql"),
    bodyParser = require("body-parser"),
    md5 = require("MD5"),
    rest = require("./REST"),
    app = express();

function REST() {
    var self = this;
    self.connectMysql();
};

REST.prototype.connectMysql = function() {
    var self = this;
    var pool = mysql.createPool({
        connectionLimit: 100,
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'restful_api_demo',
        debug: false
    });
    pool.getConnection(function(err, connection){
        if(err){
            self.stop(err);
        } else {
            self.configureExpress(connection);
        }
    });
};

REST.prototype.configureExpress = function(connection) {
    var self = this;
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    var router = express.Router();
    app.use('/api', router);
    var rest_router = new rest(router, connection, md5);
    self.startServer();
};

REST.prototype.startServer = function() {
    app.listen(3000, function(){
        console.log("Port 3000");
    });
};

REST.prototype.stop = function(err) {
    console.log("Issue with MySQL n" +  err);
    process.exit(1);
};

new REST();
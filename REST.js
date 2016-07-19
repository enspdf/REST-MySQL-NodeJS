var mysql = require("mysql");

function REST_ROUTER(router, connection, md5) {
    var self = this;
    self.handleRoutes(router, connection, md5);
};

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {
    router.get("/", function(req, res){
        res.json({"Message": "Hello World"});
    });
    router.post("/users", function(req, res) {
        var query = "INSERT INTO ??(??,??) VALUES (?,?)";
        var table = ["user_login", "user_email", "user_password", req.body.email, md5(req.body.password)];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows){
            if (err) {
                res.json({"Error": true, "Message": "Error executing MySQL query"});
            } else {
                res.json({"Error": false, "Message": "User Added! ", "id" : rows.insertId});
                /*var query2 = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";
                var table2 = ["user_info", "user_id_fk", "user_name", "user_location", rows.insertId, req.body.user_name, req.body.user_location];
                query2 = mysql.format(query2, table2);
                connection.query(query2, function(err, data){
                   if (err) {
                       res.json({"Error": true, "Message": "Error inserting data in user_info"});
                   } else {
                       res.json({"Error": false, "Message": "User and user_info added !"});
                   }
                });*/
            }
        });
    });
    router.get("/users", function(req, res) {
        var query = "SELECT * FROM ??";
        var table = ["user_login"];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if(err) {
                res.json({"Error": true, "Message": "Error executing MySQL query"});
            } else{
                res.json({"Error": false, "Message": "Success", "Users" : rows});
            }
        });
    });
    router.get("/users/:user_id", function(req, res) {
        var query = "SELECT * FROM ?? WHERE ?? = ?";
        var table = ["user_login", "user_id", req.params.user_id];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows){
            if(err){
                res.json({"Error": true, "Message": "Error executing MySQL query"});
            } else {
                res.json({"Error": false, "Message": "Success", "Users": rows});
            }
        });
    });
    router.put("/users", function(req, res) {
        var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        var table = ["user_login", "user_password", md5(req.body.password), "user_email", req.body.email];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows){
            if(err) {
                res.json({"Error": true, "Message": "Error executing MySQL query"});
            } else {
                res.json({"Error": false, "Message": "Updated the password for email " + req.body.email});
            }
        });
    });
    router.delete("/users/:email", function(req, res) {
        var query = "DELETE FROM ?? WHERE ?? = ?";
        var table = ["user_login", "user_email", req.params.email];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({"Error": true, "Message": "Error executing MySQL query"});
            } else {
                res.json({"Error": false, "Message": "Deleted the user with email " +  req.params.email});
            }
        });
    });
};

module.exports = REST_ROUTER;
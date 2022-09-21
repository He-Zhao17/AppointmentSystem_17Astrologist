const MongoClient = require('mongodb').MongoClient;
const settings = require('./settings.js');

//Linked to DB, if not exists then create one
function _connectDB(callback) {
    let url = settings.dbUrl;
    MongoClient.connect(url, function (err, db) {
        if (err) {
            callback(err, null);
            return;
        }
        //success
        callback(err, db);
    });
}

//Insert data
exports.insertOne = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).insertOne(json, function (err, result) {
            if (err) {
                callback(err, null);
                db.close;
                return;
            }
            callback(err, result);
            db.close();
        });
    });
}

//Read data
exports.find = function(collectionName, queryJson, callback) {
    _connectDB(function (err, db) {
        let json = queryJson.query || {},
            limit = Number(queryJson.limit) || 0,
            count = Number(queryJson.page) - 1,
            sort = queryJson.sort || {}
        // If page number is 0 or 1, show the first limit data
        if (count <= 0) {
            count = 0;
        } else {
            count = count * limit;
        }

        let cursor = db.collection(collectionName).find(json).limit(limit).skip(count).sort(sort);
        cursor.toArray(function (err, results) {
            if (err) {
                callback(err, null);
                db.close;
                return;
            }
            callback(err, results);
            db.close;
        });
    });
}

//Delete data
exports.deleteMany = function(collectionName, json, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).deleteMany(json, function (err, results) {
            if (err) {
                callback(err, null);
                db.close();
                return;
            }
            callback(err, results);
            db.close();
        });
    });
}

//Update data
exports.updateMany = function(collectionName, jsonOld, jsonNew, callback) {
    _connectDB(function(err, db) {
        db.collection(collectionName).updateMany(
            jsonOld, {
                $set: jsonNew,
                $currentDate: { "lastModified": false }
            },
            function(err, results) {
                if (err) {
                    callback(err, null)
                    db.close()
                    return
                }
                callback(err, results)
                db.close()
            })
    })
}
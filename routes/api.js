const db = require('./db.js');

exports.test = function (req, res, next) {
    db.find('mytest', {"query": {}}, function (err, result) {
        if (err) {
            return res.json(
                {
                    "code": 404,
                    "message": "Failed to get data.",
                    "result": []
                }
            );
        }
        return res.json(
            {
                "code": 200,
                "message": "Get data successfully.",
                "result": result,
                "total": result.length
            }
        );
    });
}

exports.addtest = function (req, res, next) {
    let newData = {
        "title": req.body.title,
        "content": req.body.content
    };
    // Insert into DB
    db.insertOne('mytest', newData, function(err, result) {
        if (err) {
            return res.json(
                {
                    "code": 401,
                    "message": "Insert in test failed."
                }
            );
        }
        return res.json(
            {
                "code": 200,
                "message": "Insert in test success."
            }
        )
    });
}
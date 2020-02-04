const mongodb = require('mongodb');
const MonggoClinet = mongodb.MongoClient;

let _db;

const urlDB = 'mongodb://127.0.0.1:27017/shop-mongodb?retryWrites=true';
const monggoConnect = callback => {
    MonggoClinet.connect(urlDB, {
            useUnifiedTopology: true
            // useNewUrlParser: true,
            // useCreateIndex: true,
            // useUnifiedTopology: true
        })
        .then(client => {
            console.log('Connected!');
            _db = client.db('test');
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err;
        })
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!';
}

exports.monggoConnect = monggoConnect;
exports.getDb = getDb;
jest.setTimeout(10000);

require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise; // mongoose does not use its own promise, so you need to tell it to use Node global promise
mongoose.connect(keys.mongoURI, { useMongoClient: true });

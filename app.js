require('dotenv').config();

const createApp = require('./src/infrastructure/http/createApp');
const buildContainer = require('./src/container');

module.exports = createApp(buildContainer());

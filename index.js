require('dotenv').config(); // allows you to define variables locally, and cross-OS

const server = require('./api/server.js');

const port = process.env.PORT || 5000; // making the PORT dynamic, if that env variable is not there then it will use 5000
server.listen(port, () => {
  console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});

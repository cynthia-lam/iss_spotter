const { nextISSTimesForMyLocation } = require('./iss_promised');
const { printPassTimes } = require('./printPassTimes');

nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes.response);
  })
  .catch((error => console.log(`Error: ${error.message}`)))
  
// index.js
const { fetchMyIP, fetchCoordsByIP } = require('./iss');

let ip;

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }
  fetchCoordsByIP(ip, (error, data) => {
    if (error) {
      console.log(error);
      return;
    }

    console.log('It worked! Returned lat/long:', data);
  });
});


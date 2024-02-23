// index.js
const { fetchMyIP, fetchCoordsByIP } = require('./iss');

let ip;

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }
  console.log('It worked! Returned IP:' , ip);
  ip = ip;

  fetchCoordsByIP(ip, (error, data) => {
    if (error) {
      console.log("It didn't work!" , error);
      return;
    }

    console.log('It worked! Returned lat/long:' , data);
  });
});


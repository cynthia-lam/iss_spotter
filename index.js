// index.js
const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

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
    const coords = data;
    fetchISSFlyOverTimes(coords, (error, data) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log('It worked! Returned times:', data);
    });
  });
});


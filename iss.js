/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');

// uses ipify to fetch IP address
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {
    // if error
    if (error) {
      return callback(error, null);
      
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);
    }

    // else return the ip
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

// takes in an IP address and returns the latitude and longitude for it.
const fetchCoordsByIP = function(ip, callback) {
  // use request to fetch longitude and latitude
  request('http://ipwho.is/' + ip, (error, response, body) => {
    // if error
    const parsedBody = JSON.parse(body);
    if (!parsedBody.success) {
      const errMessage = `Failed to find latitude and longitude. Server message: ${parsedBody.message}`
      return callback(Error(errMessage), null);
    }

    // else return the lat & long in an object 
    const lat = JSON.parse(body).latitude;
    const long = JSON.parse(body).longitude;
    const latLong = {latitude: lat,
                      longitude: long}
    callback(null, latLong);
  })
};


module.exports = { fetchMyIP, fetchCoordsByIP };


const request = require('request');

/**
 * fetchMyIP
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
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
    return callback(null, ip);
  });
};

/**
 * fetchCoordsByIP
 * Makes a single API request to retrieve a latitude/longitude based on an IP address.
 * Input:
 *   - A callback (to pass back an error or the lat/long)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The lat/long as an object (null if error). Example: { latitude: 43.653226, longitude: -79.3831843 }
 */
const fetchCoordsByIP = function(ip, callback) {
  // use request to fetch longitude and latitude
  request('http://ipwho.is/' + ip, (error, response, body) => {
    // if error
    const parsedBody = JSON.parse(body);
    if (!parsedBody.success) {
      const errMessage = `Error: Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for ${parsedBody.ip}`;
      return callback(errMessage, null);
    }

    // else return the lat & long in an object
    const { latitude, longitude } = parsedBody;
    return callback(null, { latitude, longitude });
  });
};

/**
 * fetchISSFlyOverTimes
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  const URL = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(URL, (error, response, body) => {
    // if error
    if (error) {
      return callback(error, null);
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const errMessage = `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`;
      return callback(new Error(errMessage), null);
    }

    const parsedBody = JSON.parse(body);
    return callback(null, parsedBody.response);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { fetchMyIP, nextISSTimesForMyLocation };


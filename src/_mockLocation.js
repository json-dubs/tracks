import * as Location from "expo-location";

const tenMetersWithDegrees = 0.0001;

const getLocation = (increment) => {
  return {
    timestamp: 10000000000,
    coords: {
      speed: 5,
      heading: 5,
      accuracy: 5,
      altitudeAccuracy: -1,
      altitude: 30,
      longitude: -78.81672399803305 + increment * tenMetersWithDegrees,
      latitude: 43.89113432163939 + increment * tenMetersWithDegrees,
    },
  };
};

let counter = 0;
setInterval(() => {
  Location.EventEmitter.emit("Expo.locationChanged", {
    watchId: Location._getCurrentWatchId(),
    location: getLocation(counter),
  });
  counter++;
}, 1000);

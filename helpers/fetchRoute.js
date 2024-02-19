// utils.js
import polyline from '@mapbox/polyline';

export const fetchAndDecodeRoute = async (origin, destination) => {
  const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=AIzaSyA-WRUQKmRpbmPVd6F-c0VdIqVtMMNk_TQ`;

  try {
    const response = await fetch(directionsUrl);
    const json = await response.json();
    if (json.routes.length) {
      return polyline.decode(json.routes[0].overview_polyline.points).map(array => ({
        latitude: array[0],
        longitude: array[1],
      }));
    }
    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

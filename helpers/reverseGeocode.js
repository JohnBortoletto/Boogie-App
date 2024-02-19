export const reverseGeocode = async (latitude, longitude) => {
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyA-WRUQKmRpbmPVd6F-c0VdIqVtMMNk_TQ`);
        const data = await response.json();
        return data.results[0];
    } catch (error) {
        console.error(error);
    }
};
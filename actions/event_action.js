// import axios from 'axios';
// import { FETCH_EVENTS } from './types';
// import reverseGeocode from 'latlng-to-zip';
// import qs from 'qs';

// const ROOT_URL = 'https://app.ticketmaster.com/discovery/v2/events.json?';
// const EVENT_QUERY_PARAMS = {
//     apikey: 'nkbb8t3zibRRgbAFMb5dDwdanrpbLosd',
//     radius: 25
// }
// const buildEventsUrl = (zip) => {
//     const query = qs.stringify({ ...EVENT_QUERY_PARAMS, postalCode: zip })
//     return `${ROOT_URL}${query}`;
// };

// export const fetchEvents = (region) => async (dispatch) => {
//     try {
//         let zip = await reverseGeocode(region);
//         const url = buildEventsUrl(zip);
//         let { data } = await axios.get(url);
//         dispatch({ type: FETCH_EVENTS, payload: data });
//         console.log(data);
//     } catch (err) {
//         console.error(err);
//     }

// };
// init unsplash
import { createApi } from 'unsplash-js';

// on your node server
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  //...other fetch options
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: 'кофе' || 'coffee' || 'кава',
    perPage: 40,
  });
  const unsplashResults = photos.response?.results || [];
  return unsplashResults.map((result) => result.urls['small']);
};

export const fetchCoffeeStores = async (
  latLong = '50.41560973715642,30.490211384048422',
  limit = 9
) => {
  const photos = await getListOfCoffeeStorePhotos();
  const response = await fetch(
    getUrlForCoffeeStores(latLong, 'coffee stores', limit),
    {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
      },
    }
  );
  const data = await response.json();
  return (
    data.results?.map((venue, idx) => {
      return {
        ...venue,
        id: venue.fsq_id,
        address: venue.location.address || '',
        name: venue.name,
        neighbourhood:
          venue.location.neighborhood ||
          venue.location.crossStreet ||
          venue.location.neighbourhood ||
          venue.location.cross_street ||
          '',
        imgUrl: photos[idx],
      };
    }) || []
  );
};

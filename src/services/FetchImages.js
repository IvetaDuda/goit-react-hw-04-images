function fetchImages(image, page) {
  const BASE_URL = 'https://pixabay.com/api/?';
  const KEY = '19081920-2c3ac78229fa04ecd1a30d4e6';
  return fetch(
    BASE_URL +
      `image_type=photo&orientation=horizontal&q=${image}&page=${page}&per_page=12&key=` +
      KEY
  ).then(response => {
    if (response.ok) {
      return response.json();
    }
  });
}
export default fetchImages;

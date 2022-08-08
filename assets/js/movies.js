import {
  addMovieList,
  clearMoviesMarcup,
  createMarkup,
  createStyle,
  inputSearch,
  moviesList,
  triggerMode
} from './dom.js'

let siteUrl = null;
const searchString = 'Iron Man';
let searchLast = null;

const getData = (url) => fetch(url)
  .then((res) => res.json())
  .then((json) => {
    if (!json || !json.Search) throw Error('Сервер вернул неправильный объект!')
    return json.Search;
  });

const debounce = (() => {
  let timer = null;

  return (cb, ms) => {
    if (timer) {
      clearTimeout(timer);
      timer = null
    }
    timer = setTimeout(cb, ms);
  }
})();

const inputSearchHandler = (e) => {

  debounce(() => {
    const searchString = e.target.value.trim();

    if (searchString && searchString.length > 3 && searchString !== searchLast) {
      if (!triggerMode) clearMoviesMarcup(moviesList);
      getData(`${siteUrl}?s=${searchString}&apikey=b6cd182a`)
        .then((movies) => movies.forEach(movie => addMovieList(movie)))
        .catch((err) => console.log(err));
    }

    searchLast = searchString;

  }, 2000);
};

export const appInit = (url) => {
  createStyle();
  createMarkup();

  siteUrl = url || 'https://www.omdbapi.com/';

  inputSearch.addEventListener('keyup', inputSearchHandler);
}


import { API_Key, API_URL } from "./config.js";

const parentEl = document.querySelector(".movie");
const searchTerm = document.querySelector(".search_field");
const searchBtn = document.querySelector(".search_btn");
const toWatch = document.querySelector(".toWatch");

let bookmarks = [];

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) bookmarks = JSON.parse(storage);
};
init();

const showMovie = async function () {
  try {
    const res = await fetch(
      `https://cors-anywhere.herokuapp.com/${API_URL}apikey=${API_Key}&t=${searchTerm.value}`
    );
    const data = await res.json();

    if (data.Response == "False") throw new Error(`404 Error🎇`);

    parentEl.innerHTML = "";

    renderMovie(data);
  } catch (err) {
    alert(err);
  }
};

const showBookmarks = async function () {
  try {
    parentEl.innerHTML = "";
    for (let i = 0; i < bookmarks.length; i++) {
      const res = await fetch(`https://cors-anywhere.herokuapp.com/${API_URL}apikey=${API_Key}&i=${bookmarks[i]}`);
      const data = await res.json();

      if (data.Response == "False") throw new Error(`404 Error🎇`);

      renderMovie(data);
    }
  } catch (err) {
    alert(err);
  }
};

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  showMovie();
});

toWatch.addEventListener("click", function (e) {
  e.preventDefault();
  showBookmarks();
});

const generateMarkup = function (data) {
  const markup = `
    <figure class="recipe__fig">
    <img src="${data.Poster}" alt="Poster" class="poster" />
    <h1 class="movie_title">
      <span>${data.Title}</span>
    </h1>
  </figure>

  <div class="movie_details">
    <div class="movie_year">
      
      <span class="movie_info-data movie_info-data--minutes">Year: </span>
      <span class="movie_info-text">${data.Year}</span>
    </div>
    <div class="movie_plot">
      
      <h2 class="movie_info-data movie_info-data--minutes">Plot</h2>
      <p class="movie_info-text">${data.Plot}</p>
    </div>

     
    
    <button class="btn--round green" id="bookm">
      Need to watch
    </button>
  </div>

  
      <sub>Rating: ${data.imdbRating}</sub>
      
  </div>`;

  return markup;
};

const renderMovie = function (data) {
  const markup = generateMarkup(data);

  parentEl.insertAdjacentHTML("afterbegin", markup);
  const bookmark = document.querySelector("#bookm");
  if (bookmarks.includes(data.imdbID)) {
    bookmark.classList.remove("green");
    bookmark.classList.add("red");
  }
  bookmark.addEventListener("click", function (e) {
    e.preventDefault();
    if (bookmarks.includes(data.imdbID)) {
      let index = bookmarks.indexOf(data.imdbID);
      bookmarks.splice(index, 1);
      bookmark.classList.add("green");
      bookmark.classList.remove("red");
    } else {
      bookmarks.push(data.imdbID);
      bookmark.classList.remove("green");
      bookmark.classList.add("red");
    }
  });
  persistBookmarks();
};

const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
};

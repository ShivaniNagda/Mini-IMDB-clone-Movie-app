//---------------------- Search Movie list -------------------------------------

const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const resultgrid = document.getElementById("res-grid");
const favResultgrid = document.getElementById("fav-res-grid");
const favContainer = document.getElementById("fav-res-container");

// Fetch movie from api

async function fetchMovieData(search) {
  const URL = `https://www.omdbapi.com/?s=${search}&page=1&apikey=66e070d7`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  if (data.Response == "True") 
    showMovieList(data.Search);
}

function findMovies() {
  let searchItem = movieSearchBox.value.trim();
  if (searchItem.length > 0) {
    searchList.classList.remove("hide-search-list");
    fetchMovieData(searchItem);
  } else {
    searchList.classList.add("hide-search-list");
  }
}

function showMovieList(movies) {
  searchList.innerHTML = "";
  for (let id = 0; id < movies.length; id++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies[id].imdbID;
    movieListItem.classList.add("search-list-item");
    if (movies[id].Poster !== "N/A") moviePoster = movies[id].Poster;
    else moviePoster = "image_not_found.jpg";
    movieListItem.innerHTML = `
                                    <div class="search-item-thumbnail">
                                        <img src="${moviePoster}">
                                    </div>
                                    <div class="search-item-info">
                                        <h3>${movies[id].Title}</h3>
                                        <p>${movies[id].Year}</p>
                                    </div>
                                `;
    searchList.appendChild(movieListItem);
  }
  fetchMovieDetails();
}

function fetchMovieDetails() {
  const searchListMovies = searchList.querySelectorAll(".search-list-item");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async (e) => {
      e.preventDefault();
      searchList.classList.add("hide-search-list");
      movieSearchBox.value = "";
      const result = await fetch(
        `https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=66e070d7`
      );
      const moviesDetails = await result.json();
      showMovieDetails(moviesDetails);
    });
  });
}
function showMovieDetails(details) {
  resultgrid.innerHTML = `
    <div class="movie-banner">
                        <img src="${
                          details.Poster !== "N/A"
                            ? details.Poster
                            : "image_not_found.jpg"
                        }" alt="Movie Banner here..........">

                        </div>
                        <div class="movie-info">
                            <h3 class="movie-title">${details.Title}</h3>
                            <ul class="movie-misc-info">
                                <li class="year">Year: ${details.Year}</li>
                                <li class="rating">Rating : ${
                                  details.Rated
                                }</li>
                                <li class="released">Released:${
                                  details.Released
                                }</li>
                            </ul>
                            <p class="genre">
                                <b>Genre:</b>${details.Genre}
                            </p>
                            <p class="writer">
                                <b>Writer:</b>${details.Writer}
                            </p>
                            <p class="actors">
                                <b>Actors:</b>${details.Actors}
                            </p>
                            <p class="plot"><b>plot:</b>${details.Plot}</p>
                            <p class="language"><b>Language:</b>${
                              details.Language
                            }</p>
                            <p class="award"><b><i class="fas fa-award"></i></b> ${
                              details.Awards
                            }</p>
                              <button id="fav-btn" class="favorite-button">Add to Favorites ❤️</button>
                        </div>`;
                       
  const favButton = document.getElementById("fav-btn");
  favButton.addEventListener("click", (e) =>{
     addToFavorites(details)});
  
}
// Favourite -------------------------------------------------------------------------------------------------

function addToFavorites(movie) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Check if the movie is already in favorites
  if (favorites.some((fav) => fav.imdbID === movie.imdbID)) {
    alert(`${movie.Title} is already in your favorites!`);
    return;
  }

  favorites.push(movie);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert(`${movie.Title} has been added to your favorites!`);
}
function showFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favResultgrid.innerHTML = `
    <div class="favorites-header">
      <h2>Your Favorite Movies</h2>
    </div>
    <div class="favorites-grid"></div>
  `;
  const favoritesGrid = favResultgrid.querySelector(".favorites-grid");

  favorites.forEach((movie) => {
    let movieItem = document.createElement("div");
    movieItem.classList.add("favorite-movie-item");

    movieItem.innerHTML = `
      <img src="${
        movie.Poster !== "N/A" ? movie.Poster : "image_not_found.jpg"
      }" alt="${movie.Title} Poster">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
    `;

    favoritesGrid.appendChild(movieItem);
  });
}

// -------------------------------------------------------------------------------------------------------
window.addEventListener("click", (event) => {
  // event.preventDefault();
  if (event.target.className !== "form-control") {
    searchList.classList.add("hide-search-list");
  }
});

// -----------------------trendings top rated----------------------------------------

fetch(`https://www.omdbapi.com/?t=movie&page=1&apikey=66e070d7`)
  .then((res) => res.json())
  .then((data) => {
    console.log("trending", data);
    const headrow = document.getElementById("headrow");
    const row = document.createElement("div");
    row.className = "row";
    row.id = "trendingg";
    headrow.appendChild(row);
    row.innerHTML = `
     <h2 id="movie">Movie</h2>
      </br>
      <div id="trending">
    <div  class="row-movie-banner">
   
   
                        <img class="poster" src="${
                          data.Poster !== "N/A"
                            ? data.Poster
                            : "image_not_found.jpg"
                        }" alt="Movie Banner here..........">

                        </div>
                        <div class="movie-info-all">
                            <h3 class="movie-title-row">${data.Title}</h3>
                            <ul class="movie-misc-info-row">
                                <li class="year">Year: ${data.Year}</li>
                                <li class="rating">Rating : ${data.Rated}</li>
                                <li class="released">Released:${
                                  data.Released
                                }</li>
                            </ul>
                            <p class="genre">
                                <b>Genre:</b>${data.Genre}
                            </p>
                            <p class="writer">
                                <b>Writer:</b>${data.Writer}
                            </p>
                            <p class="actors">
                                <b>Actors:</b>${data.Actors}
                            </p>
                            <p class="plot"><b>plot:</b>${data.Plot}</p>
                            <p class="language"><b>Language:</b>${
                              data.Language
                            }</p>
                            <p class="award"><b><i class="fas fa-award"></i></b> ${
                              data.Awards
                            }</p>
                          
                      </div>   
                   </div>`;
  });

// Comedy
fetch(`https://www.omdbapi.com/?t=comedy&page=1&apikey=66e070d7`)
  .then((res) => res.json())
  .then((data) => {
    console.log("trending", data);
    const headrow = document.getElementById("headrow");
    const row = document.createElement("div");
    row.className = "row";
    row.id = "trendingg";
    headrow.appendChild(row);
    row.innerHTML = `
     <h2  id="comedy" >Comedy</h2>
      </br>
      <div id="trending">
    <div class="row-movie-banner">
   
   
                        <img class="poster" src="${
                          data.Poster !== "N/A"
                            ? data.Poster
                            : "image_not_found.jpg"
                        }" alt="Movie Banner here..........">

                        </div>
                        <div class="movie-info-all">
                            <h3 class="movie-title-row">${data.Title}</h3>
                            <ul class="movie-misc-info-row">
                                <li class="year">Year: ${data.Year}</li>
                                <li class="rating">Rating : ${data.Rated}</li>
                                <li class="released">Released:${
                                  data.Released
                                }</li>
                            </ul>
                            <p class="genre">
                                <b>Genre:</b>${data.Genre}
                            </p>
                            <p class="writer">
                                <b>Writer:</b>${data.Writer}
                            </p>
                            <p class="actors">
                                <b>Actors:</b>${data.Actors}
                            </p>
                            <p class="plot"><b>plot:</b>${data.Plot}</p>
                            <p class="language"><b>Language:</b>${
                              data.Language
                            }</p>
                            <p class="award"><b><i class="fas fa-award"></i></b> ${
                              data.Awards
                            }</p>
                      </div>  </div>`;
  });
// Series
fetch(`https://www.omdbapi.com/?t=series&page=1&apikey=66e070d7`)
  .then((res) => res.json())
  .then((data) => {
    console.log("trending", data);
    const headrow = document.getElementById("headrow");
    const row = document.createElement("div");
    row.className = "row";
    row.id = "trendingg";
    headrow.appendChild(row);
    row.innerHTML = `
     <h2 id="series">Series</h2>
      </br>
      <div id="trending">
    <div  class="row-movie-banner">
   
   
                        <img class="poster" src="${
                          data.Poster !== "N/A"
                            ? data.Poster
                            : "image_not_found.jpg"
                        }" alt="Movie Banner here..........">

                        </div>
                        <div class="movie-info-all">
                            <h3 class="movie-title-row">${data.Title}</h3>
                            <ul class="movie-misc-info-row">
                                <li class="year">Year: ${data.Year}</li>
                                <li class="rating">Rating : ${data.Rated}</li>
                                <li class="released">Released:${
                                  data.Released
                                }</li>
                            </ul>
                            <p class="genre">
                                <b>Genre:</b>${data.Genre}
                            </p>
                            <p class="writer">
                                <b>Writer:</b>${data.Writer}
                            </p>
                            <p class="actors">
                                <b>Actors:</b>${data.Actors}
                            </p>
                            <p class="plot"><b>plot:</b>${data.Plot}</p>
                            <p class="language"><b>Language:</b>${
                              data.Language
                            }</p>
                            <p class="award"><b><i class="fas fa-award"></i></b> ${
                              data.Awards
                            }</p>
                      </div>  </div>`;
  });

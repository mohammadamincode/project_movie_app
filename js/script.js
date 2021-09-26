const API_Key = "api_key=7223c1d8e9476510262ac760d7196bd2";
const Base_Url = "https://api.themoviedb.org/3";
const API_Url = Base_Url + "/discover/movie?sort_by=popularity.desc&" + API_Key;
const IMG_Url = "https://image.tmdb.org/t/p/w500/";
const searchURL = Base_Url + "/search/movie?" + API_Key;
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags");
const prev = document.getElementById("prev");
const current = document.getElementById("current");
const next = document.getElementById("next");
const up = document.getElementById("up");
const header = document.getElementById("header");
const pagination = document.getElementById("pagination");

window.onscroll = function () {
  scrollFunction();
};

let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let totalPages = 500;
let lastUrl = "";

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];
let selectedGenre = [];
setGenre();
function setGenre() {
  tagsEl.innerHTML = "";
  genres.forEach((genre) => {
    const t = document.createElement("div");
    t.classList.add("tag");
    t.id = genre.id;
    t.innerText = genre.name;
    t.addEventListener("click", () => {
      if (selectedGenre.length == 0) {
        selectedGenre.push(genre.id);
      } else {
        if (selectedGenre.includes(genre.id)) {
          selectedGenre.forEach((id, idx) => {
            if (id == genre.id) {
              selectedGenre.splice(idx, 1);
            }
          });
        } else {
          selectedGenre.push(genre.id);
        }
      }
      getMovies(API_Url + "&with_genres=" + encodeURI(selectedGenre.join(",")));
      highlightSelection();
    });
    tagsEl.append(t);
  });
}

function clearBtn() {
  let clearBtn = document.getElementById("clear");
  if (clearBtn) {
    clearBtn.classList.add("highlight");
  } else {
    let clear = document.createElement("div");
    clear.classList.add("tag", "clear");
    clear.id = "clear";
    clear.innerText = "Clear x";
    clear.addEventListener("click", () => {
      selectedGenre = [];
      setGenre();
      getMovies(API_Url);
    });
    tagsEl.append(clear);
  }
}

getMovies(API_Url);
function getMovies(url) {
  tagsEl.scrollIntoView({
    behavior: "smooth",
  });
  lastUrl = url;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results);
      if (data.results.length !== 0) {
        showMovies(data.results);
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPages = data.total_pages;

        current.innerText = currentPage;
        if (currentPage <= 1) {
          prev.classList.add("disabled");
          next.classList.remove("disabled");
        } else if (currentPage >= totalPages) {
          prev.classList.remove("disabled");
          prev.classList.add("next");
          next.classList.add("disabled");
        } else {
          prev.classList.remove("disabled");
          next.classList.remove("disabled");
        }
      } else {
        main.innerHTML = `
        <h1 class="no-result">No Results Found</h1>
        <button id="back">Back</button>
        `;
        pagination.classList.add("is-disabled");
        const back = document.getElementById("back");
        back.addEventListener("click", () => {
          selectedGenre = [];
          setGenre();
          getMovies(API_Url);
        });
      }
    });
}

function showMovies(data) {
  main.innerHTML = "";

  data.forEach((movie) => {
    const {
      title,
      poster_path,
      vote_average,
      overview,
      vote_count,
      release_date,
    } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
    <div class="movie-image">
    <img src="${
      poster_path
        ? IMG_Url + poster_path
        : "https://fakeimg.pl/300x500/373b69/000/?text=No Image :("
    }" alt="${title}">
    
    </div>

          <div class="movie-info">
              <h3>${title}</h3>
              <span class="${getColor(vote_average)}">${vote_average}</span>
          </div>
          <div class="movie-info-button"><button>Info<i class="fa fa-arrow-circle-up" aria-hidden="true"></i></button>
          <div class="overview">
          <h2>${title}</h2>
         <p> <span>${vote_average} of 10 | ${vote_count} votes</span></p>
         <p>${release_date}</p>
              <h3>Overview</h3>
              <p id="story">${overview}</p>
          </div>
          </div>
      `;
    main.appendChild(movieEl);
    pagination.classList.remove("is-disabled");
  });
}
function getColor(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote <= 5) {
    return "red";
  } else {
    return "orange";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  selectedGenre = [];
  setGenre();
  if (searchTerm) {
    getMovies(searchURL + "&query=" + searchTerm);
    home.classList.remove("is-disabled");
  } else {
    getMovies(API_Url);
  }
});

const logo = document.getElementById("logo");
logo.addEventListener("click", (e) => {
  location.reload();
});

function highlightSelection() {
  search.value = "";
  const tags = document.querySelectorAll(".tag");
  tags.forEach((tag) => {
    tag.classList.remove("highlight");
  });
  clearBtn();
  if (selectedGenre.length != 0) {
    selectedGenre.forEach((id) => {
      const highlightedTag = document.getElementById(id);
      highlightedTag.classList.add("highlight");
    });
  } else {
    setGenre();
  }
}

const refresh = document.getElementById("refresh");
refresh.addEventListener("click", (e) => {
  selectedGenre = [];
  setGenre();
  getMovies(API_Url);
  search.value = "";
});

next.addEventListener("click", () => {
  if (nextPage <= totalPages) {
    pageCall(nextPage);
  }
});
prev.addEventListener("click", () => {
  if (prevPage > 0) {
    pageCall(prevPage);
  }
});
function pageCall(page) {
  let urlSplit = lastUrl.split("?");
  let queryParams = urlSplit[1].split("&");
  let key = queryParams[queryParams.length - 1].split("=");
  if (key[0] != "page") {
    let url = lastUrl + "&page=" + page;
    getMovies(url);
  } else {
    key[1] = page.toString();
    let a = key.join("=");
    queryParams[queryParams.length - 1] = a;
    let b = queryParams.join("&");
    let url = urlSplit[0] + "?" + b;
    getMovies(url);
  }
}

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    up.style.display = "block";
  } else {
    up.style.display = "none";
  }
}

function topFunction() {
  header.scrollIntoView({
    behavior: "smooth",
  });
}

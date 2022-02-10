import i180bj from './translate.js';

let language = 'en';
let query = '';
let page = 1;
let url = `https://api.themoviedb.org/3/search/movie?api_key=f72149d6bc624d0a624f793a656c6f1a&query=${query}&page=${page}&language=${language}`;
let genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=f72149d6bc624d0a624f793a656c6f1a&language=${language}`;

const languageBtn = document.querySelector('.switch-lng');
languageBtn.addEventListener('click', switchLng);
function switchLng() {
    if(language == 'en') {
        language = 'ru';
    } else {
        language = 'en'
    }
    localStorage.setItem('language',language);
    location.reload();
}

const form = document.getElementById('search');
form/addEventListener('input', getInputValue);
function getInputValue() {
    query = form.value;
    localStorage.setItem('query',query);
    page = 1;
    localStorage.setItem('page',page);
}

const pageNum = document.querySelector('.page-num');

function getLocalStorage() {
    query = localStorage.getItem('query');
    language = localStorage.getItem('language');
    page = localStorage.getItem('page');
    pageNum.textContent = page;
    form.placeholder = query;
    const langElements = document.querySelectorAll('[data-i18]');
    langElements.forEach(elem => elem.textContent = i180bj[language][elem.dataset.i18]);
    url = `https://api.themoviedb.org/3/search/movie?api_key=f72149d6bc624d0a624f793a656c6f1a&query=${query}&page=${page}&language=${language}`;
    genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=f72149d6bc624d0a624f793a656c6f1a&language=${language}`;
    getData();
}
window.addEventListener('load',getLocalStorage);

async function getData() {
    const res = await fetch(url);
    const genreRes = await fetch(genreUrl);
    const data = await res.json();
    const genreData = await genreRes.json();
    showData(data,genreData);
    console.log(data);
}

function showData(data, genreData) {
    const cardWrapper = document.querySelector('.card-wrapper');
    const searchStat = document.querySelector('.search-stat');
    const totalResults = data.total_results;
    if(language == 'ru') {
        searchStat.textContent = `По запросу '${query}' найдено ${totalResults} фильмов`;
    } else {
        searchStat.textContent = `'${query}' : found ${totalResults} movies`;
    }
    
    if(query == '' && language == 'en') {
        searchStat.textContent = `Empty query`;
    } 
    if(query == '' && language == 'ru') {
        searchStat.textContent = `Пустой запрос`;
    } 
    data.results.map(elem => {
        const card = `<div class="card-item">
        <p class="card-rating">${elem.vote_average.toFixed(1)}</p>
        <div class="card-img-wrapper">
            <img src="https://image.tmdb.org/t/p/w300${elem.poster_path}" alt="image" class="card-img">
        </div>
        <div class="card-info">
            <h3>${elem.title} ${getDate(elem)}</h3>
        </div>
        <div class="card-overview">
            <p>${getGenre(elem)}</p>
        </div>
        <div class="card-menu">
                    <p>${elem.overview}</p>
                </div>
        </div>`;
        cardWrapper.insertAdjacentHTML('beforeend', card);
    })

    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    prevBtn.addEventListener('click', prevPage);
    nextBtn.addEventListener('click', nextPage);
    function prevPage() {
        if(page > 1) {
            page--;
            localStorage.setItem('page',page);
            location.reload();
        }
        
    }

    function nextPage() {
        if(page < (data.total_pages)) {
            page++;
        localStorage.setItem('page',page);
        location.reload();
        }
    }

    setRatingColor();   

    function setRatingColor() {
        const cardRating = document.querySelectorAll('.card-rating');
        cardRating.forEach(elem => {
            if(Number(elem.textContent) < 4) {
                elem.style.color = 'red';
            } else if(Number(elem.textContent) < 6) {
                elem.style.color = 'orange';
            } else if(Number(elem.textContent) < 7) {
                elem.style.color = 'yellow';
            } else {
                elem.style.color = 'green';
            }
            if(Number(elem.textContent) == 0) {
                elem.style.display = "none"
            }
        })
    }
    
    function getGenre(elem) {
        let result = "";
        genreData.genres.forEach(x => {
            if(elem.genre_ids.includes(x.id)) {
                result = result + x.name + ", ";
            }
        })
        return result.slice(0, -2);
    }

    function getDate(elem) {
        if(elem.release_date) {
            return '(' + elem.release_date.substring(0,4) + ')';
        } else return '';
        
    }
}

//----------------------


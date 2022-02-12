import i180bj from './translate.js';

console.log(`Score: 70
Вёрстка: +10;
При загрузке приложения на странице отображаются карточки фильмов с полученными от API данными: +10;
Если в поле поиска ввести слово и отправить поисковый запрос, на странице отобразятся карточки фильмов, в названиях которых есть это слово, если такие данные предоставляет API: +10;
Поиск: +30;
Очень высокое качество оформления приложения и/или дополнительный не предусмотренный в задании функционал, улучшающий качество приложения: +10;
Добавлены:
- меню с описанием и ссылкой на фильм в Google;
- статистика запроса: "по запросу (х) найдено (y) фильмов";
- раздел: популярное;
- переключение языка en ru;
- рейтинг фильма в правом верхнем углу карточки;
- жанры;
- переключение страниц на следующую и предыдущую;
`);

let language = 'en';
let query = '';
let page = 1;
let url = '';
let genreUrl = '';
let searchMode;

const popularBtn = document.querySelector('.popular-btn');
popularBtn.addEventListener('click', switchMode);
function switchMode() {
    searchMode = 'false';
    localStorage.setItem('searchMode',searchMode);
    page = 1;
    localStorage.setItem('page',page);
    location.reload();
}

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
form.addEventListener('input', getInputValue);
function getInputValue() {
    searchMode = 'true';
    localStorage.setItem('searchMode',searchMode);
    query = form.value;
    localStorage.setItem('query',query);
    page = 1;
    localStorage.setItem('page',page);
    if(form.value == "") {
        form.placeholder = i180bj[language][form.dataset.i18];
    }
}

const pageNum = document.querySelector('.page-num');

function getLocalStorage() {
    if(localStorage.getItem('query')) {
        query = localStorage.getItem('query');
    }

    if(language = localStorage.getItem('language')) {
        language = localStorage.getItem('language');
    } else language = "en";

    if(localStorage.getItem('page')) {
        page = localStorage.getItem('page');
    }
    if(localStorage.getItem('searchMode')) {
        searchMode = localStorage.getItem('searchMode');
    }

    form.value = query;

    const crossBtn = document.querySelector('.cross-btn');
    crossBtn.addEventListener('click', function clearForm() {
        form.placeholder = i180bj[language][form.dataset.i18];
        form.value = "";
    }
    )
    if(form.value == "") {
        form.placeholder = i180bj[language][form.dataset.i18];
    }
        

    const langElements = document.querySelectorAll('[data-i18]');
    langElements.forEach(elem => elem.textContent = i180bj[language][elem.dataset.i18]);
    genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=f72149d6bc624d0a624f793a656c6f1a&language=${language}`;
    if(searchMode == 'true') {
        url = `https://api.themoviedb.org/3/search/movie?api_key=f72149d6bc624d0a624f793a656c6f1a&query=${query}&page=${page}&language=${language}`;
    } else {
        url = `https://api.themoviedb.org/3/movie/popular?api_key=f72149d6bc624d0a624f793a656c6f1a&language=${language}&page=${page}`
        query = "";
        localStorage.setItem('query',query);
        form.value = "";
        form.placeholder = i180bj[language][form.dataset.i18];
    }

    getData();
}
window.addEventListener('load',getLocalStorage);

async function getData() {
    const res = await fetch(url);
    const genreRes = await fetch(genreUrl);
    const data = await res.json();
    const genreData = await genreRes.json();
    showData(data,genreData);
}

function showData(data, genreData) {
    const cardWrapper = document.querySelector('.card-wrapper');
    const searchStat = document.querySelector('.search-stat');
    const totalResults = data.total_results;
    if(searchMode == 'true') {
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
    } else if(language == 'ru') {
        searchStat.textContent = `Популярные фильмы`;
    } else {
        searchStat.textContent = `Popular films`;
    }
    
    data.results.map(elem => {
        const card = `<div class="card-item">
        <p class="card-rating">${elem.vote_average.toFixed(1)}</p>
        <div class="card-img-wrapper">
            <img src="${getImage(elem)}" alt="image" class="card-img">
        </div>
        <div class="card-info">
            <h3>${elem.title} ${getDate(elem)}</h3>
        </div>
        <div class="card-overview">
            <p>${getGenre(elem)}</p>
        </div>
        <div class="card-menu">
                    <p>${getDescription(elem)}</p>
                    <a href="https://www.google.com/search?q=${elem.title} ${getDate(elem)}" target="_blank">${language == 'ru' ? "Открыть в Google" : "Open in Google"}</a>
                </div>
        </div>`;
        cardWrapper.insertAdjacentHTML('beforeend', card);
    })

    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    pageNum.textContent = page + ' / ' + data.total_pages;
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

    function getImage(elem) {
        if(elem.poster_path) {
            return `https://image.tmdb.org/t/p/w300${elem.poster_path}`
        } else {
            return 'assets/img/noimage.jpg'
        }
    }

    function getDescription(elem) {
        if(elem.overview == "" && language == "en") {
            return "No description"
        } 
        if(elem.overview == "" && language == "ru") {
            return "Нет описания"
        }
        return elem.overview;
    }
}

//----------------------


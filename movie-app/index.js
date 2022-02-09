let language = 'en';
let query = 'spring';
let page = 1;
let url = `https://api.themoviedb.org/3/search/movie?api_key=f72149d6bc624d0a624f793a656c6f1a&query=${query}&page=${page}&language=${language}`;
let genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=f72149d6bc624d0a624f793a656c6f1a&language=${language}`;


getData();

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
    searchStat.textContent = `${query} : found ${totalResults} movies`;
    if(query == '') {
        searchStat.textContent = `Empty query`;
    } 
    data.results.map(elem => {
        console.log(elem);
        const card = `<div class="card-item">
        <p class="card-rating">${elem.vote_average.toFixed(1)}</p>
        <div class="card-img-wrapper">
            <img src="https://image.tmdb.org/t/p/w300${elem.poster_path}" alt="image" class="card-img">
        </div>
        <div class="card-info">
            <h3>${elem.title} (${elem.release_date.substring(0,4)})</h3>
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

    // const cardItems = document.querySelectorAll('.card-items');
    // cardItems.forEach(item => item.addEventListener("mouseenter", openDescription));
    // cardItems.forEach(item => item.addEventListener("mouseleave", closeDescription));

    // function openDescription(event) {
    //     event.target.lastElementChildren.classList.add('active');
    // }

    // function closeDescription(event) {
    //     event.target.classList.remove('active');
    // }
    

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
        })
    }
    
    function getGenre(elem) {
        result = "";
        genreData.genres.forEach(x => {
            if(elem.genre_ids.includes(x.id)) {
                result = result + x.name + ", ";
            }
        })
        return result.slice(0, -2);
    }
}

//----------------------


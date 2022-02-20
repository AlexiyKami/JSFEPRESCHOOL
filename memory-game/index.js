console.log(`Вёрстка +10
Логика игры. Карточки, по которым кликнул игрок, переворачиваются согласно правилам игры +10
Игра завершается, когда открыты все карточки +10
По окончанию игры выводится её результат - количество ходов, которые понадобились для завершения игры +10
Результаты последних 10 игр сохраняются в local storage. Есть таблица рекордов, в которой сохраняются результаты предыдущих 10 игр +10
По клику на карточку – она переворачивается плавно, если пара не совпадает – обе карточки так же плавно переварачиваются рубашкой вверх +10
Очень высокое качество оформления приложения и/или дополнительный не предусмотренный в задании функционал, улучшающий качество приложения +10
Добавлены:
- Адаптивная верстка
- Стартовое меню с описанием правил игры
- Кнопка перезапуска после окончания игры
- Меню Scores и Records
- Score содержит результаты последних 10 игр
- Records содержит лучшие результаты (минимальная сумма (seconds + moves))`)

const cards = document.querySelectorAll('.memory-card');
cards.forEach(card => card.addEventListener('click', flipCard))

const timer = document.querySelector('.timer');
const movesCount = document.querySelector('.moves');

const scoresMenu = document.querySelector('.menu-scores');
const scoresMenuBtn = document.querySelector('.score-btn');

const recordsMenu = document.querySelector('.menu-records');
const recordsMenuBtn = document.querySelector('.record-btn');

const winTitle = document.querySelector('.win-title');
const restartBtn = document.querySelector('.restart-btn');

const cardWrapper = document.querySelector('.card-wrapper');
const startMenu = document.querySelector('.start-menu');
const startBtn = document.querySelector('.start-btn');

scoresMenuBtn.addEventListener('click', () => {
    recordsMenu.classList.remove('active');
    scoresMenu.classList.toggle('active');
    
});

recordsMenuBtn.addEventListener('click',() => {
    scoresMenu.classList.remove('active');
    recordsMenu.classList.toggle('active');
})

restartBtn.addEventListener('click', restartGame);
startBtn.addEventListener('click', startGame);

let moves = 0;
let hour = 0;
let min = 0
let sec = 0;
let time = 0;

let hasFlippedCard = false;
let lockBoard  = false;
let firstCard;
let secondCard;
let scoreArr = [];
let recordArr = [];
let isPlay = false;

function startGame() {
    isPlay = true;
    startMenu.classList.add('hidden');
    cardWrapper.style.display = "flex";
}

function restartGame() {
    
    resetStats();
    hideWinTitle();
    setTimeout(() => {
        shuffle();
    }, 1000)
    cards.forEach(card => {
        card.classList.remove('flip');
        card.addEventListener('click', flipCard);
    });
    isPlay = true;
}

function flipCard() {

    if(lockBoard || this === firstCard) return;

    this.classList.add('flip');

    if(hasFlippedCard == false) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    movesCount.textContent = `Moves: ${++moves}`;
    secondCard = this;

    checkForMatch();
    checkForWin();
}

function checkForMatch() {
    if (firstCard.dataset.framework === secondCard.dataset.framework) {
        disableCards();
        return;
    }

    unflipCards();
}

function checkForWin() {
    let hasWin = true;
    cards.forEach(card => {
        if(!card.classList.contains('flip')) {
            hasWin = false;
        }
    })
    if(hasWin === true) {
        isPlay = false;
        setScore();
        getScore();
        getRecord();
        showWinTitle();
    };
}

function showWinTitle() {
    winTitle.classList.add('active');
    winTitle.insertAdjacentHTML('afterbegin',`<h3 class="win-stat">Moves: ${moves}, Time: ${getTime()}</h3>`)
}

function hideWinTitle() {
    winTitle.classList.remove('active');
    document.querySelector('.win-stat').remove();
}

function setScore() {
    let scoreObj = {
        moves: moves,
        time : getTime(),
        date : getDate(),
        seconds : time,
        points : moves + time
    }

    scoreArr.unshift(scoreObj);
    if(scoreArr.length > 10) {
        scoreArr.pop();
    }
    localStorage.setItem('scoreArr', JSON.stringify(scoreArr));
}

window.addEventListener('load', () => {
    getScore();
    getRecord();
});

function getScore() {
    if(localStorage.getItem('scoreArr')) {
        scoreArr = JSON.parse(localStorage.getItem('scoreArr'));
        scoresMenu.innerHTML = '';
        scoresMenu.insertAdjacentHTML('beforeend', `<h3>Last 10 games: </h3>`);
    } else {
        scoresMenu.insertAdjacentHTML('beforeend', `<h3>Last 10 games: </h3>
        <h4>There are no scores here</h4>`);
    }
    scoreArr.forEach((elem,index) => {
        const scoreTitle = `<div class="score"><h4>Time: ${elem.time}, Moves: ${elem.moves}</h4>
        <h5>${elem.date}</h5></div>`
        scoresMenu.insertAdjacentHTML('beforeend', scoreTitle);
    })
    
}

function setRecord() {
    recordArr = scoreArr.slice().sort((a, b) => a.points - b.points);
    if(recordArr.length > 10) {
        recordArr.pop();
    }
}

function getRecord() {
    setRecord();
    if(localStorage.getItem('scoreArr')) {
        recordsMenu.innerHTML = '';
        recordsMenu.insertAdjacentHTML('beforeend', `<h3>Top 10: </h3>`);
    } else {
        scoresMenu.insertAdjacentHTML('beforeend', `<h3>Top 10: </h3>
        <h4>There are no records here</h4>`);
    }
    recordArr.forEach((elem,index) => {
        const recordTitle = `<div class="record"><h4>${index + 1}. Time: ${elem.time}, Moves: ${elem.moves}</h4>
        <h5>${elem.date}</h5></div>`
        recordsMenu.insertAdjacentHTML('beforeend', recordTitle);
    })
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function shuffle() {
    cards.forEach(card => {
      let randomPos = Math.floor(Math.random() * 12);
      card.style.order = randomPos;
    });
};
shuffle();

function resetStats() {
    moves = 0;
    hour = 0;
    min = 0;
    sec = 0;
    time = 0;
}


setInterval(() => {
    if(isPlay) {
        timer.textContent = `Time: ${getTime(true)}`;
    }
} , 1000);

function getTime(addSec) {
    if(addSec) {
        sec++;
        time++;
    }
    if(sec >= 60) {
        sec = 0;
        min++;
    }

    if(min >= 60) {
        min = 0;
        hour++;
    }
    return `${String(hour).length < 2 ? '0' + hour : hour}:${String(min).length < 2 ? '0' + min : min}:${String(sec).length < 2 ? '0' + sec : sec}`;
}

function getDate() {
    let date = new Date();
    let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    let hours = String(date.getHours()).length < 2 ? '0' + date.getHours() : date.getHours();
    let minutes = String(date.getMinutes()).length < 2 ? '0' + date.getMinutes() : date.getMinutes();
    let seconds = String(date.getSeconds()).length < 2 ? '0' + date.getSeconds() : date.getSeconds();
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${hours}:${minutes}:${seconds}`;
}


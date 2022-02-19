const cards = document.querySelectorAll('.memory-card');
cards.forEach(card => card.addEventListener('click', flipCard))

const timer = document.querySelector('.timer');
const movesCount = document.querySelector('.moves');

const recordsMenu = document.querySelector('.menu-records');
const recordsMenuBtn = document.querySelector('.menu-btn');

const winTitle = document.querySelector('.win-title');
const restartBtn = document.querySelector('.restart-btn');

recordsMenuBtn.addEventListener('click', () => recordsMenu.classList.toggle('active'));
restartBtn.addEventListener('click', () => location.reload());

let moves = 0;
let hour = 0;
let min = 0
let sec = 0;

let hasFlippedCard = false;
let lockBoard  = false;
let firstCard;
let secondCard;
let recordArr = [];
let hasEnded = false;

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
        hasEnded = true;
        setRecord();
        getRecord();
        showWinTitle();
    };
}

function showWinTitle() {
    winTitle.classList.add('active');
    winTitle.insertAdjacentHTML('afterbegin',`<h3>Moves: ${moves}, Time: ${getTime()}</h3>`)
}

function setRecord() {
    let recordObj = {
        moves: moves,
        time : getTime(),
        date : getDate()
    }

    recordArr.unshift(recordObj);
    if(recordArr.length > 10) {
        recordArr.pop();
    }
    localStorage.setItem('recordArr', JSON.stringify(recordArr));
}

window.addEventListener('load', getRecord());

function getRecord() {
    if(localStorage.getItem('recordArr')) {
        recordArr = JSON.parse(localStorage.getItem('recordArr'));
        recordsMenu.innerHTML = '';
        recordsMenu.insertAdjacentHTML('beforeend', `<h3>Last scores: </h3>`);
    } else {
        recordsMenu.insertAdjacentHTML('beforeend', `<h3>Last scores: </h3>
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

(function shuffle() {
    cards.forEach(card => {
      let randomPos = Math.floor(Math.random() * 12);
      card.style.order = randomPos;
    });
})();



setInterval(() => {
    if(!hasEnded) {
        timer.textContent = `Time: ${getTime(true)}`;
    }
} , 1000);

function getTime(addSec) {
    if(addSec) {
        sec++;
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
    return `${months[date.getMonth()]} ${date.getDay()}, ${date.getFullYear()} ${hours}:${minutes}:${seconds}`;
}


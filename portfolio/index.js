import i180bj from './translate.js';

let lang = "en";
let theme = "dark";

console.log("Score: 85 \nLayout matches pattern(768px): + 48\n>320px has no horizontal scroll bar: + 15\nAdaptive menu: + 22");
// -------------hamburger menu-------------
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');
const menuLinks = document.querySelectorAll('.menu ul li a');

function toggleMenu() {
  hamburger.classList.toggle('change');
  menu.classList.contains('menu') ? menu.classList.remove('menu') : menu.classList.add('menu');
  menu.classList.toggle('active-menu');
}

menuLinks.forEach((i) => i.addEventListener('click',toggleMenu));

hamburger.addEventListener('click', toggleMenu);


// -------------portfolio-images-------------

const portfolioBtns = document.querySelector('.portfolio-btns');
const portfolioImages = document.querySelectorAll('.portfolio-img');

function changeImage(event) {
  if(event.target.classList.contains('portfolio-btn')) {
    portfolioImages.forEach((img, index) => img.src = `./assets/img/${event.target.dataset.season}/${index + 1}.jpg`);
  }
}

portfolioBtns.addEventListener("click", changeImage);

// -------------preloader-------------
const seasons = ['winter', 'spring', 'summer', 'autumn'];

function preloadSummerImages() {
  seasons.forEach((season) => {
    for (let i=0; i < portfolioImages.length;i++) {
      let img = new Image();
      img.src = `./assets/img/${season}/${i + 1}.jpg`
    }
  });
}

preloadSummerImages();

// -------------active button-------------

function changeClassActive(className) {
  const classes = document.querySelectorAll(`.${className}`);
  classes.forEach(x => x.addEventListener("click", () =>  {
    classes.forEach(y => y.classList.remove('active'));
    x.classList.add('active');
  }, false));
}

changeClassActive('portfolio-btn');

// -------------translate-------------

function getTranslate(language) {
  const lng = document.querySelectorAll(`.${language}`);
  lng.forEach(elem => elem.classList.add('active'))
  let elements = document.querySelectorAll('[data-i18]');
  elements.forEach(elem => elem.textContent = i180bj[language][elem.dataset.i18])
  lang = language;
}

function switchLng(event) {
  event.target.classList.add('active')
  if(event.target.classList.contains('ru')) {
    getTranslate('ru');
  } else if(event.target.classList.contains('en')) {
    getTranslate('en');
  }
}

changeClassActive('lng-btn');
const lngBtns = document.querySelector('.switch-lng');
lngBtns.addEventListener("click", switchLng, false);

// -------------light-theme-------------

const lightElements = document.querySelectorAll('.section-title');

function changeLightTheme(event) {
  lightElements.forEach(elem => elem.classList.toggle('light-theme'))
  if(!event.target.classList.contains('active')) {
    event.target.classList.add('active');
    theme = 'light';
  } else {
    event.target.classList.remove('active');
    theme = 'dark';
  }
  switchTheme(theme);

}

function switchTheme(theme) {
  if(theme === "light") {
    document.getElementById("switch-theme").classList.add('active');
    document.getElementById("switch-theme").src = 'assets/svg/moon.svg';
    document.documentElement.style.setProperty('--color-bg', '#fff');
    document.documentElement.style.setProperty('--color-font-gold', '#000');
    document.documentElement.style.setProperty('--color-font-white', '#000'); 
  }
  if (theme === "dark") {
    document.getElementById("switch-theme").src = 'assets/svg/sun.svg';
    document.documentElement.style.setProperty('--color-bg', '#000');
    document.documentElement.style.setProperty('--color-font-gold', '#BDAE82');
    document.documentElement.style.setProperty('--color-font-white', '#fff');
  }
}  
const switchThemeBtn = document.querySelector('.switch-theme');
switchThemeBtn.addEventListener("click", changeLightTheme);

function setLocalStorage() {
  localStorage.setItem('lang', lang);
  if(document.getElementById("switch-theme").classList.contains('active')) {
    localStorage.setItem('theme', 'light');
  }
  else {
    localStorage.setItem('theme', 'dark');
  }
}

window.addEventListener('beforeunload',setLocalStorage);

function getLocalStorage() {
  if(localStorage.getItem('lang')) {
    const lang = localStorage.getItem('lang');
    getTranslate(lang);
  }

  if(localStorage.getItem('theme')) {
    const theme = localStorage.getItem('theme');
    switchTheme(theme);
  }

}

window.addEventListener('load', getLocalStorage)


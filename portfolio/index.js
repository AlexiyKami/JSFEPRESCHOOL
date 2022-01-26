console.log("Score: 85 \nLayout matches pattern(768px): + 48\n>320px has no horizontal scroll bar: + 15\nAdaptive menu: + 22");
// -------------hamburger menu-------------
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');
const menuLinks = document.querySelectorAll('.menu ul li a');

function toggleMenu() {
  hamburger.classList.toggle('change');
  menu.classList.contains('menu') ? menu.classList.remove('menu') : menu.classList.add('menu');
  menu.classList.toggle('active');
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
  seasons.forEach((season,index) => {
    for (let i=0; i < portfolioImages.length;i++) {
      let img = new Image();
      img.src = `./assets/img/${season}/${i + 1}.jpg`
      console.log(img);
    }
  });
}
preloadSummerImages();
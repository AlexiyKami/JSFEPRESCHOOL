console.log("Score: 110 \nValidator: + 10\nSemantic layout: + 20\nLayout matches pattern: + 48\nCSS requirements: + 12\nInteractivity: + 20");

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


console.log("Score: 85 \nLayout matches pattern(768px): + 48\n>320px has no horizontal scroll bar: + 15\nAdaptive menu: + 22");

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


// Плавный скролл
const htmlPage = document.querySelector('.header-nav__item');
htmlPage.scrollIntoView({
  behavior: "smooth",
  block:    "start",
});

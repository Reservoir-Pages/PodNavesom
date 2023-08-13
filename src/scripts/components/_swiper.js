import Swiper from 'swiper/bundle';

const galleries = document.querySelectorAll('.gallery__item');
const overlay = document.querySelector('.gallery__overlay');
let swiper;
let swiperBtns;
let gallerySwiper;

galleries.forEach(gallery => {
  const images = gallery.querySelectorAll('.gallery__images-img');
  images.forEach(image => {
    image.addEventListener('click', (e) => {
      if (gallerySwiper && gallerySwiper.classList.contains('gallery__content--swiper')) {
        return;
      } else {
        document.body.classList.add('overflow-hidden');
        overlay.classList.remove('is-hidden');
        swiperBtns = gallery.querySelector('.swiper-btns');
        gallerySwiper = gallery.querySelector('.gallery__content');
        gallerySwiper.classList.add('gallery__content--swiper');
        swiperBtns.classList.remove('is-hidden');

        swiper = new Swiper('.gallery__content--swiper', {
          loop: true,
          slidesPerView: 1,
          spaceBetween: 15,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        });
      }
    });
  });
});

overlay.addEventListener('click', (e) => {
  document.body.classList.remove('overflow-hidden');
  overlay.classList.add('is-hidden');
  if (swiperBtns) {
    swiperBtns.classList.add('is-hidden');
  };
  if (gallerySwiper) {
    gallerySwiper.classList.remove('gallery__content--swiper');
  };
  swiper.destroy();
});

new Swiper('.swiper-container', {
  effect: 'fade',
  speed: 500,
  loop: true,
  autoplay: true,
  pagination: {
    el: '.swiper-pagination'
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  }
})

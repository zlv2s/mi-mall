require(['config'], function () {
  require([
    'swiper',
    'jquery',
    'template',
    'api',
    'header',
    'footer'
  ], function (Swiper, $, template, api) {
    api.product.getDetail(12511).then(res => {
      console.log(res)
      $(function () {
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
      })
    })
  })
})

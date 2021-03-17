require(['config'], function () {
  require(['swiper', 'jquery', 'header', 'footer'], function (Swiper, $) {
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
    $.ajax({
      url: `http://localhost:3030/api/mi-mall/product/12511`,
      success(res) {
        console.log(res)
      }
    })
  })
})

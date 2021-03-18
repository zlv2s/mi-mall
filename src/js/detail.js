require(['config'], function () {
  require([
    'jquery',
    'swiper',
    './js/template/detail',
    'api',
    'utils',
    'header',
    'footer'
  ], function ($, Swiper, template, api, utils) {
    const { product_id } = utils.getUrlKey(location.href)
    if (!product_id) {
      return
    }

    api.product.getDetail(product_id).then(res => {
      console.log(res)

      $(function () {
        $('.detail').append(
          template('detail', {
            product: res.data
          })
        )
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

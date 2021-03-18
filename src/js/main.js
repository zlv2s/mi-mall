require(['config'], function () {
  require([
    'jquery',
    'swiper',
    'js/template/template',
    'api',
    'utils',
    'header',
    'footer'
  ], function ($, Swiper, template, api, utils) {
    function renderSwiper(swiperList) {
      $('#swiper>.swiper-wrapper').html(template('swiperItem', { swiperList }))

      const swiper = new Swiper('#swiper', {
        spaceBetween: 30,
        effect: 'fade',
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      })

      swiper.el.onmouseover = function () {
        swiper.autoplay.stop()
      }

      swiper.el.onmouseout = function () {
        swiper.autoplay.start()
      }
    }

    function renderPromo(promoList) {
      $('.home-promo-list').html(template('promoItem', { promoList }))
    }

    function renderChannelList(channelList) {
      $('.home-channel-list').html(template('channelItem', { channelList }))
    }

    function renderFlashSwiper(flashSlideList) {
      $('#swiper2>.swiper-wrapper').html(
        template('swiper2Item', { flashSlideList })
      )
      new Swiper('#swiper2', {
        slidesPerView: 4,
        spaceBetween: 14,
        slidesPerGroup: 4,
        speed: 1000,
        noSwiping: true,
        navigation: {
          nextEl: '.btn-next',
          prevEl: '.btn-prev',
          disabledClass: 'navigation-disabled'
        }
      })
    }

    function renderFloor(goodsFloorData) {
      $('.page-main .container').append(
        $(template('floorItem', { goodsFloorData }))
      )
    }

    $(function () {
      api.product.getAll().then(res => {
        if (res.status === 0) {
          const {
            swiperList,
            promoList,
            flashSlideList,
            goodsFloorData,
            channelList
          } = res.data
          renderSwiper(swiperList)
          renderPromo(
            promoList.map(item => ({
              link: `/detail.html?product_id=${
                utils.getUrlKey(item.link)['product_id']
              }`,
              imgUrl: item.imgUrl
            }))
          )
          renderChannelList(channelList)
          renderFlashSwiper(
            flashSlideList.map(item => ({
              ...item,
              link: `/detail.html?product_id=${item.product_id}`
            }))
          )
          renderFloor(goodsFloorData)
        }
      })
    })
  })
})

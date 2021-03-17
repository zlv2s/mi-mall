require(['config'], function () {
  require(['jquery', 'swiper', 'template', 'header', 'footer'], function (
    $,
    Swiper,
    template
  ) {
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
      $.ajax({
        url: 'http://localhost:3030/api/mi-mall/product/all',
        success(res) {
          const {
            swiperList,
            promoList,
            flashSlideList,
            goodsFloorData,
            channelList
          } = res.data
          renderSwiper(swiperList)
          renderPromo(promoList)
          renderChannelList(channelList)
          renderFlashSwiper(flashSlideList)
          renderFloor(goodsFloorData)
        }
      })
    })
  })
})

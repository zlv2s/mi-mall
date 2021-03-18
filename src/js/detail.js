require(['config'], function () {
  require([
    'jquery',
    'swiper',
    './js/template/template',
    'api',
    'utils',
    'header',
    'footer'
  ], function ($, Swiper, template, api, utils) {
    const { product_id } = utils.getUrlKey(location.href)
    const propList = []

    if (!product_id) {
      location.href = '/'
    }

    api.product.getDetail(product_id).then(res => {
      console.log(res)

      $(function () {
        $('.detail').append(
          template('detail', {
            product: res.data
          })
        )

        $('.option-box li').click(function (e) {
          e.preventDefault()
          $(this).addClass('active').siblings().removeClass('active')
          getIdByActive()
          updateGoodsInfo()
          initSwiper()
          console.log($(this))
        })

        getIdByActive()

        function initSwiper() {
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
        }

        function getIdByActive() {
          propList.length = 0
          $('.option-box li').each(function (i, ele) {
            if ($(this).hasClass('active')) {
              propList.push({
                prop_cfg_id: $(this).parents('.option-box').data().oid,
                prop_value_id: $(this).data().pid
              })
            }
          })
        }

        function getGoodsByProps() {
          return res.data.detailItem.goods_list.find(
            goods =>
              JSON.stringify(goods.goods_info.prop_list) ===
              JSON.stringify(propList)
          )
        }

        function updateGoodsInfo() {
          const goods = getGoodsByProps()
          console.log(goods)
          $('.price-info').text(goods.goods_info.price + ' 元')
          $('.selected-list li')
            .contents()
            .filter(function () {
              return this.nodeType == 3
            })
            .first()
            .replaceWith(goods.goods_info.name)
          $('.selected-list li')
            .find('span')
            .text(goods.goods_info.price + '元')
          $('.total-price').text(`总计：${goods.goods_info.price}元`)
          $('.swiper-wrapper').html(
            template('detailSwiper', { imgList: goods.goods_info.imgs })
          )
        }

        updateGoodsInfo()
        initSwiper()
      })
    })
  })
})

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
    const goodsItem = {
      propList: [],
      isChangeColor: false,
      currentItem: null
    }

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

          goodsItem.isChangeColor =
            $(this).parents('.option-box').children('.title').text() ===
            '选择颜色'
          getIdByActive()
          updateGoodsInfo()
          if (goodsItem.isChangeColor) initSwiper()
        })

        $('.sale-btn a').click(function (e) {
          e.preventDefault()
          api.cart
            .addToCart({
              goodsId: goodsItem.currentItem.goods_info.goods_id,
              num: 1
            })
            .then(res => {
              console.log(res)
            })
        })

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
          goodsItem.propList.length = 0
          $('.option-box li').each(function (i, ele) {
            if ($(this).hasClass('active')) {
              goodsItem.propList.push({
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
              JSON.stringify(goodsItem.propList)
          )
        }

        function updateGoodsInfo() {
          const goods = (goodsItem.currentItem = getGoodsByProps())
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
          if (goodsItem.isChangeColor) {
            $('.swiper-wrapper').html(
              template('detailSwiper', { imgList: goods.goods_info.imgs })
            )
          }
        }

        getIdByActive()
        updateGoodsInfo()
        initSwiper()
      })
    })
  })
})

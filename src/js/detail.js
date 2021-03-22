require(['config'], function () {
  require([
    'jquery',
    'swiper',
    './js/template/template',
    'api',
    'utils',
    'common',
    'header',
    'footer'
  ], function ($, Swiper, template, api, utils, { modal, go }) {
    const detail = {
      product_id: utils.getUrlKey(location.href).product_id,
      product: null,
      goodsItem: {
        propList: [],
        isChangeColor: false,
        currentItem: null
      },

      init() {
        this.checkPid()
        this.getProductDetail().then(() => {
          this.render()
          this.bind()
          this.getIdByActive()
          this.updateGoodsInfo()
          this.initSwiper()
        })
      },
      checkPid() {
        if (!this.product_id) {
          go('/')
        }
      },

      // 轮播图初始化
      initSwiper() {
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
      },

      // 根据 active 类名获取属性id
      getIdByActive() {
        const d = this
        this.goodsItem.propList.length = 0
        $('.option-box li').each(function (i, ele) {
          if ($(this).hasClass('active')) {
            d.goodsItem.propList.push({
              prop_cfg_id: $(this).parents('.option-box').data().oid,
              prop_value_id: $(this).data().pid
            })
          }
        })
      },

      // 根据属性 id 筛选对应产品
      getGoodsByProps() {
        return (
          this.product.detailItem.goods_list.find(
            goods =>
              JSON.stringify(goods.goods_info.prop_list) ===
              JSON.stringify(this.goodsItem.propList)
          ) || this.product.detailItem.goods_list[0]
        )
      },

      // 根据当前选中的产品更新页面信息
      updateGoodsInfo() {
        const goods = (this.goodsItem.currentItem = this.getGoodsByProps())
        console.log('当前选择商品', goods)
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
        if (this.goodsItem.isChangeColor) {
          $('.swiper-wrapper').html(
            template('detailSwiper', { imgList: goods.goods_info.imgs })
          )
        }
      },

      getProductDetail() {
        return api.product.getDetail(this.product_id).then(res => {
          this.product = res.data
        })
      },

      render() {
        const d = this
        $('.detail').append(
          template('detail', {
            product: d.product
          })
        )
      },

      bind() {
        const d = this
        // 切换选择框
        $('.option-box li').click(function (e) {
          e.preventDefault()
          $(this).addClass('active').siblings().removeClass('active')
          // 判断是否更改了产品颜色
          d.goodsItem.isChangeColor =
            $(this).parents('.option-box').children('.title').text() ===
            '选择颜色'
          d.getIdByActive()
          d.updateGoodsInfo()
          // 颜色如果更改，轮播图重新渲染
          if (d.goodsItem.isChangeColor) d.initSwiper()
        })

        // 添加到购物车
        $('.sale-btn a').click(function (e) {
          e.preventDefault()
          // 判断是否登录
          if (!utils.storage.get('user')) {
            modal({
              title: '提示',
              body: '<div class="alert-message">请登录后再操作</div>',
              onConfirm: () => (location.href = '/login.html')
            }).fadeIn()
            return
          }

          api.cart
            .addToCart({
              goodsId: d.goodsItem.currentItem.goods_info.goods_id,
              num: 1
            })
            .then(res => {
              go(
                `/successTip.html?gid=${d.goodsItem.currentItem.goods_info.goods_id}`
              )
            })
        })
      }
    }

    $(function () {
      detail.init()
    })
    // // 根据 url 获取产品 id
    // const { product_id } = utils.getUrlKey(location.href)
    // const goodsItem = {
    //   propList: [],
    //   isChangeColor: false,
    //   currentItem: null
    // }

    // if (!product_id) {
    //   go('/')
    // }

    // 获取商品详情
    // api.product.getDetail(product_id).then(res => {
    //   console.log('获取商品详情：', res)
    //   $(function () {
    //     $('.detail').append(
    //       template('detail', {
    //         product: res.data
    //       })
    //     )
    //     // 切换选择框
    //     $('.option-box li').click(function (e) {
    //       e.preventDefault()
    //       $(this).addClass('active').siblings().removeClass('active')
    //       // 判断是否更改了产品颜色
    //       goodsItem.isChangeColor =
    //         $(this).parents('.option-box').children('.title').text() ===
    //         '选择颜色'
    //       getIdByActive()
    //       updateGoodsInfo()
    //       // 颜色如果更改，轮播图重新渲染
    //       if (goodsItem.isChangeColor) initSwiper()
    //     })

    //     // 添加到购物车
    //     $('.sale-btn a').click(function (e) {
    //       e.preventDefault()
    //       // 判断是否登录
    //       if (!utils.storage.get('user')) {
    //         modal({
    //           title: '提示',
    //           body: '<div class="alert-message">请登录后再操作</div>',
    //           onConfirm: () => (location.href = '/login.html')
    //         }).fadeIn()
    //         return
    //       }

    //       api.cart
    //         .addToCart({
    //           goodsId: goodsItem.currentItem.goods_info.goods_id,
    //           num: 1
    //         })
    //         .then(res => {
    //           go(
    //             `/successTip.html?gid=${goodsItem.currentItem.goods_info.goods_id}`
    //           )
    //         })
    //     })

    //     // 轮播图初始化
    //     function initSwiper() {
    //       new Swiper('.swiper-container', {
    //         effect: 'fade',
    //         speed: 500,
    //         loop: true,
    //         autoplay: true,
    //         pagination: {
    //           el: '.swiper-pagination'
    //         },
    //         navigation: {
    //           nextEl: '.swiper-button-next',
    //           prevEl: '.swiper-button-prev'
    //         }
    //       })
    //     }

    //     // 根据 active 类名获取属性id
    //     function getIdByActive() {
    //       goodsItem.propList.length = 0
    //       $('.option-box li').each(function (i, ele) {
    //         if ($(this).hasClass('active')) {
    //           goodsItem.propList.push({
    //             prop_cfg_id: $(this).parents('.option-box').data().oid,
    //             prop_value_id: $(this).data().pid
    //           })
    //         }
    //       })
    //     }

    //     // 根据属性 id 筛选对应产品
    //     function getGoodsByProps() {
    //       return res.data.detailItem.goods_list.find(
    //         goods =>
    //           JSON.stringify(goods.goods_info.prop_list) ===
    //           JSON.stringify(goodsItem.propList)
    //       )
    //     }

    //     // 根据当前选中的产品更新页面信息
    //     function updateGoodsInfo() {
    //       const goods = (goodsItem.currentItem = getGoodsByProps())
    //       console.log('当前选择商品', goods)
    //       $('.price-info').text(goods.goods_info.price + ' 元')
    //       $('.selected-list li')
    //         .contents()
    //         .filter(function () {
    //           return this.nodeType == 3
    //         })
    //         .first()
    //         .replaceWith(goods.goods_info.name)
    //       $('.selected-list li')
    //         .find('span')
    //         .text(goods.goods_info.price + '元')
    //       $('.total-price').text(`总计：${goods.goods_info.price}元`)
    //       if (goodsItem.isChangeColor) {
    //         $('.swiper-wrapper').html(
    //           template('detailSwiper', { imgList: goods.goods_info.imgs })
    //         )
    //       }
    //     }

    //     getIdByActive()
    //     updateGoodsInfo()
    //     initSwiper()
    //   })
    // })
  })
})

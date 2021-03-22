require(['./config'], function () {
  require([
    'jquery',
    './js/template/template',
    'api',
    'utils',
    'common',
    'header',
    'footer'
  ], function ($, template, api, utils, { checkLogin, go }) {
    const successTip = {
      gid: utils.getUrlKey(location.href)['gid'],
      recomList: [],

      check() {
        if (!checkLogin() || !this.gid) return go('/cart.html')
      },

      init() {
        this.check()
        this.getItemDetail(this.gid).then(item => {
          this.renderSubtitle(item.name)
          this.getCartRec(item.commodity_id).then(() => {
            this.renderRecItem()
            this.bind()
          })
        })
      },

      getItemDetail(gid) {
        return api.cart.getItem(gid).then(res => {
          return res.data[0]
        })
      },

      getCartRec(cid) {
        return api.cart.getCartRec(cid).then(res => {
          this.recomList = res.data.map(x => x.info)
        })
      },

      renderRecItem() {
        $('.recommend-list').html(
          template('cartRecItem', { recomList: this.recomList })
        )
      },

      renderSubtitle(title) {
        $('.goods-info .name').text(title)
      },

      bind() {
        const s = this
        $('.recommend-action a').click(function () {
          const recommendItem = $(this).parents('.recommend-item')
          s.addToCart({
            goodsId: recommendItem.data().gid,
            productId: recommendItem.data().pid
          }).then(res => {
            if (res.status === 0) {
              recommendItem.find('.recommend-notice').addClass('show-notice')
              setTimeout(() => {
                recommendItem
                  .find('.recommend-notice')
                  .removeClass('show-notice')
              }, 800)
            }
          })
        })
      },

      addToCart({ goodsId, productId }) {
        return api.cart.addToCart({ goodsId, productId })
      }
    }

    $(function () {
      $('.actions .btn-primary').click(function () {
        go('/cart.html')
      })

      $('.actions .btn-gray').click(function () {
        // to do
        //  返回上一级
      })
      successTip.init()
    })
  })
})

require(['./config'], function () {
  require([
    'jquery',
    'api',
    './js/template/template',
    'utils',
    'common',
    'footer',
    'notify'
  ], function ($, api, template, utils, { checkLogin, onLogin, go, modal }) {
    const order = {
      cOid: utils.getUrlKey(location.href).cOid,
      detailHeight: 0,
      _orderInfo: {},

      get orderInfo() {
        return this._orderInfo
      },
      set orderInfo(orderInfo) {
        this._orderInfo = orderInfo
        this.renderOrderInfo(orderInfo)
        this.bind()
        this.calcDetailHeight()
      },

      init() {
        // 渲染公共头部
        $('body').prepend(template('subHeader', { title: '支付订单' }))
        if (checkLogin()) {
          onLogin()
          $('.loading-wrapper').html(template('loading'))
          this.getOderInfo(this.cOid)
            .then(res => {
              console.log('getOrderInfo', res)
              if (res.status === 1) {
                $.notify(`${res.message}`, { type: 'danger' })
              } else {
                $('.confirm-context').show()
                $('.loading-wrapper').remove()
                this.orderInfo = res.data.orderInfo
              }
            })
            .catch(err => {})
        } else {
          console.log('未登录')
          go('/')
        }
      },

      bind() {
        const od = this
        $('.show-detail').click(function () {
          console.log(od.detailHeight)
          if ($('.order-detail').height() === od.detailHeight) {
            $('.order-detail').height(0)
          } else {
            $('.order-detail').height(od.detailHeight)
          }
        })
      },

      renderOrderInfo(orderInfo) {
        $('.order-detail ul').html(template('orderDetail', { orderInfo }))
        $('.total .money').html(
          template('orderFee', { fee: orderInfo.grandTotalPrice })
        )
      },

      // 根据商品内容，动态计算高度
      calcDetailHeight() {
        const od = this
        od.detailHeight = 0
        od.detailHeight += parseInt($('.order-detail ul').css('margin-top'))
        od.detailHeight += parseInt($('.order-detail ul').css('padding-top'))
        $('.order-detail ul li').each(function (idx, ele) {
          console.log($(ele).outerHeight(true))
          od.detailHeight += $(ele).outerHeight(true)
        })
      },

      getOderInfo(cOid) {
        return api.order.getOrderInfo(cOid)
      }
    }

    $(function () {
      order.init()
    })
  })
})

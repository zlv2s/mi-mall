require(['./config'], function () {
  require([
    'jquery',
    'api',
    './js/template/template',
    'utils',
    'common',
    'footer'
  ], function ($, api, template, utils, { checkLogin, onLogin, go, modal }) {
    const order = {
      init() {
        // 渲染公共头部
        $('body').prepend(template('subHeader', { title: '支付订单' }))
        if (checkLogin()) {
          onLogin()
          this.bind()
        } else {
          console.log('未登录')
          go('/')
        }
      },
      bind() {
        $('.show-detail').click(function () {
          if ($('.order-detail').height() === 166) {
            $('.order-detail').height(0)
          } else {
            $('.order-detail').height(166)
          }
        })
      }
    }

    $(function () {
      order.init()
    })
  })
})

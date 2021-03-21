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
    if (!checkLogin()) {
      location.href = '/cart.html'
      return
    }

    api.cart.getCartRec(8888).then(res => {
      $('.recommend-list').html(
        template('cartRecItem', { recomList: res.data.map(x => x.info) })
      )

      $('.recommend-action a').click(function () {
        $(this)
          .parents('.recommend-item')
          .find('.recommend-notice')
          .addClass('show-notice')
        setTimeout(() => {
          $(this)
            .parents('.recommend-item')
            .find('.recommend-notice')
            .removeClass('show-notice')
        }, 800)
      })
    })

    $('.actions .btn-primary').click(function () {
      go('/cart.html')
    })

    $('.actions .btn-gray').click(function () {
      // to do
      //  返回上一级
    })
  })
})

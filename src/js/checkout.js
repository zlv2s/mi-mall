require(['./config'], function () {
  require([
    'jquery',
    'api',
    './js/template/template',
    'utils',
    'common'
  ], function ($, api, template, utils, {}) {
    const checkout = {
      checkout() {
        api.cart.checkout().then()
      }
    }
    $('body').prepend(template('subHeader', { title: '确认订单' }))
  })
})

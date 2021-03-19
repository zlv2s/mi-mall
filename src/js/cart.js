require(['./config'], function () {
  require([
    'jquery',
    'api',
    './js/template/template',
    'utils',
    'common'
  ], function ($, api, template, utils, { checkLogin, handleLogin }) {
    api.cart.getCartList().then(res => {
      checkLogin()
      console.log(res)

      $('.list-body').html(template('cartItem', { cartItems: res.data }))

      const cart = {
        totalCount: getTotalCount(res.data),
        grandTotal: getGrandTotal(res.data),
        checkedAll: ifCheckedAll(res.data)
      }

      $('.total-num:first').text(cart.totalCount)
      $('.totalprice-num').text(cart.grandTotal)
      $('.list-head .icon-checkbox').addClass(cart.checkedAll ? 'select' : '')
    })

    function getTotalCount(list) {
      return list.map(x => x.num).reduce((acc, count) => acc + count)
    }

    function getGrandTotal(list) {
      return list.map(x => x.totalPrice).reduce((acc, count) => acc + count)
    }

    function ifCheckedAll(list) {
      return list.every(x => x.isChecked)
    }

    $.subscribe('login', handleLogin())
  })
})

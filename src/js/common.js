define(['jquery', 'utils', './js/template/template', 'pubsub'], function (
  $,
  utils,
  template
) {
  function checkLogin() {
    const user = utils.storage.get('user')
    console.log('登录状态', user)
    if (user) {
      $.publish('login', user)
    } else {
      $('.user').hide()
      $('.topbar-info .link:last').hide()
    }
    return user
  }

  function modal({
    title = '提示',
    body = '默认信息',
    showCancel = true,
    onConfirm,
    onCancel
  }) {
    const m = $('.mi-popup')

    m.html(template('mi-popup', { title, body }))

    if (!showCancel) {
      $('.mi-popup__footer .btn-gray').hide()
    }

    // 点击右上角关闭 modal
    $('.mi-close').click(function () {
      m.fadeOut()
    })

    // 确认
    $('.mi-popup__footer .btn-primary').click(function () {
      onConfirm ? onConfirm() : m.fadeOut()
    })
    // 取消
    $('.mi-popup__footer .btn-gray').click(function () {
      onCancel ? onCancel() : m.fadeOut()
    })

    return m
  }

  function go(route) {
    location.href = route
  }

  function handleLogin() {
    return function (_, user) {
      console.log('handle login', user)
      $('span.user')
        .find('.name')
        .text(user.userInfo.username)
        .parents('.user')
        .show()
      $('.topbar-info .link:not(:last)').hide()
      $('.topbar-info .sep:first').hide()

      $('.c-login').hide()
      $('.c-user').show()
      $('.empty-cart-wrapper').hide()
      $('.cart-wrapper').show()
    }
  }
  return {
    checkLogin,
    handleLogin,
    modal,
    go
  }
})

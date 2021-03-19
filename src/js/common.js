define(['jquery', 'utils', 'pubsub'], function ($, utils) {
  function checkLogin() {
    const user = utils.storage.get('user')
    if (user) {
      $.publish('login', user)
    } else {
      $('.user').hide()
      $('.topbar-info .link:last').hide()
    }
  }

  function handleLogin() {
    return function (_, user) {
      console.log(user)
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
    handleLogin
  }
})

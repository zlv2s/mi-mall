require(['config'], function () {
  require(['jquery', 'utils', 'api'], function ($, utils, api) {
    $(function () {
      const tab = {
        _status: 0,
        get status() {
          return this._status
        },

        set status(v) {
          this._status = v
          toggleTab(v)
          toggleActive(v)
        },

        _errTips: '',
        get errTips() {
          return this.errTips
        },
        set errTips(v) {
          this._errTips = v
          setErrTips(v)
        }
      }

      tab.status = 0

      function toggleTab(status) {
        if (status === 0) {
          $('#register').hide()
          $('#login').show()
          $('label[for="re-password"]').removeClass('show')
        } else {
          $('#register').show()
          $('#login').hide()
          $('label[for="re-password"]').addClass('show')
        }
      }

      function setErrTips(tips) {
        $('.err-tip').show(200)
        $('.err-con').text(tips)
      }

      function toggleActive(status) {
        $('.login-tabs a')
          .eq(status)
          .addClass('now')
          .siblings()
          .removeClass('now')
      }

      $('.login-tabs').on('click', 'a', function (e) {
        tab.status = +e.target.dataset.index
      })

      $('#login').click(function () {
        api.user
          .signIn({
            username: $('#username').val(),
            password: $('#password').val()
          })
          .then(res => {
            console.log(res)
            if (res.status === 0) {
              console.log('登录成功')
              utils.storage.set('user', {
                token: res.data.token,
                userInfo: res.data.userInfo
              })
              location.href = '/'
            } else {
              tab.errTips = res.message
            }
          })
      })

      $('#register').click(function () {
        api.user
          .signUp({
            username: $('#username').val(),
            password: $('#password').val()
          })
          .then(res => {
            console.log(res)
            if (res.status === 0) {
              console.log('注册成功')
              target.status = 0
            } else {
              tab.errTips = res.message
            }
          })
      })

      $('.login-logo').click(function () {
        location.href = '/'
      })

      $(window).on('hashchange', function (e) {
        if (location.hash === '#register') {
          tab.status = 1
        } else {
          tab.status = 0
        }
      })
    })
  })
})

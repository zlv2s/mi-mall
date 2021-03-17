require(['config'], function () {
  require(['jquery', 'utils', 'api'], function ($, utils, api) {
    $(function () {
      const tab = {
        _status: 0,
        get status() {
          return this._status
        },

        set status(val) {
          this._status = val
          checkStatus(val)
        },

        _errTips: '',
        get errTips() {
          return this.errTips
        },
        set errTips(v) {
          this._errTips = v
          $('.err-tip').show(200)
          setErrTips(v)
        }
      }

      tab.status = 0

      function checkStatus(status) {
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
        $('.err-con').text(tips)
      }

      $('.login-tabs').on('click', 'a', function (e) {
        tab.status = +e.target.dataset.index
        $(this).addClass('now').siblings().removeClass('now')
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
    })
  })
})

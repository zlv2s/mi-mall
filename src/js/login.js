require(['config'], function () {
  require(['jquery'], function ($) {
    $(function () {
      const tabStatus = {
        _status: 0,
        get status() {
          return this._status
        },

        set status(val) {
          this._status = val
          checkStatus(val)
        }
      }
      let username = $('#username')
      let password = $('#password')
      tabStatus.status = 0

      function checkStatus(status) {
        if (status === 0) {
          $('#register').hide()
          $('label[for="re-password"]').hide(200)
          $('#login').show()
        } else {
          $('#register').show()
          $('label[for="re-password"]').show(200)
          $('#login').hide()
        }
      }

      $('#login-tab').click(function () {
        tabStatus.status = 0
      })
      $('#register-tab').click(function () {
        tabStatus.status = 1
      })

      $('#login').click(function () {
        $.ajax({
          url: 'http://localhost:3030/api/mi-mall/user/signIn',
          method: 'post',
          data: {
            username: username.val(),
            password: password.val()
          },
          dataType: 'json',
          success(res) {
            if (res.status !== 0) {
              $('.err-tip').toggle()
              $('.err-con').text(res.message)
            }
          },
          error(err) {
            console.log(err)
          }
        })
      })

      $('#register').click(function () {
        $.ajax({
          url: 'http://localhost:3030/api/mi-mall/user/signUp',
          method: 'post',
          data: {
            username: username.val(),
            password: password.val()
          },
          dataType: 'json',
          success(res) {
            if (res.status !== 0) {
              $('.err-tip').toggle()
              $('.err-con').text(res.message)
            }
          },
          error(err) {
            console.log(err)
          }
        })
      })
    })
  })
})

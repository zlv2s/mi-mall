require(['config'], function () {
  require(['jquery', 'validate', 'utils', 'api', 'common'], function (
    $,
    v,
    utils,
    api,
    { modal }
  ) {
    const form = {
      _status: 0,
      get status() {
        return this._status
      },

      set status(v) {
        this._status = v
        this.toggleTab(v)
        this.toggleActive(v)
        this.clearPassword()
      },

      _errTips: '',
      get errTips() {
        return this.errTips
      },
      set errTips(v) {
        this._errTips = v
        this.setErrTips(v)
      },

      init() {
        this.watchOnHash()
        this.bind()
      },

      clearPassword() {
        $('#password').val('')
        $('#rePassword').val('')
      },

      toggleTab(status) {
        console.log('toggleTab')
        this.errTips = ''
        if (status === 0) {
          $('#register').hide()
          $('#login').show()
          $('#rePassword').addClass('hide').removeClass('show')
        } else {
          $('#register').show()
          $('#login').hide()
          $('#rePassword').addClass('show').removeClass('hide')
        }
      },

      setErrTips(tips) {
        if (!tips) {
          $('.err-tip').hide()
        } else {
          $('.err-tip').show(200)
        }
        $('.err-con').text(tips)
      },

      toggleActive(status) {
        $('.login-tabs a')
          .eq(status)
          .addClass('now')
          .siblings()
          .removeClass('now')
      },

      watchOnHash() {
        if (location.hash === '#register') {
          this.status = 1
        } else {
          this.status = 0
        }
      },

      signIn() {
        console.log(555)
        api.user
          .signIn({
            username: $('#username').val(),
            password: $('#password').val()
          })
          .then(res => {
            if (res.status === 0) {
              console.log('登录成功')
              utils.storage.set('user', {
                token: res.data.token,
                userInfo: res.data.userInfo
              })
              location.href = '/'
            } else {
              this.errTips = res.message
            }
          })
      },

      signUp() {
        console.log(666)
        api.user
          .signUp({
            username: $('#username').val(),
            password: $('#password').val()
          })
          .then(res => {
            console.log(res)
            if (res.status === 0) {
              console.log('注册成功')
              modal({
                body: '<div class="alert-message">注册成功！</div>'
              })
              this.status = 0
            } else {
              this.errTips = res.message
            }
          })
      },

      formValidate() {
        const fm = this

        $('#loginForm').validate({
          errorElement: 'em',
          // invalidHandler(e, validator) {
          //   const errors = validator.numberOfInvalids()
          //   console.log(errors)
          //   if (errors) {
          //     fm.errTips = `数据输入格式不对，请重新输入！`
          //   } else {
          //     fm.errTips = ''
          //   }
          // },

          submitHandler(ele, event) {
            if (fm.status) {
              fm.signUp()
            } else {
              fm.signIn()
            }
          },
          rules: {
            username: {
              required: true,
              minlength: 2
            },
            password: {
              required: true,
              minlength: 5
            },
            rePassword: {
              required: true,
              minlength: 5,
              equalTo: '#password'
            }
          },
          messages: {
            username: {
              required: '请输入用户名',
              minlength: '用户名最小长度为2'
            },
            password: {
              required: '请输入密码',
              minlength: '密码长度不能小于 5 个字母'
            },
            rePassword: {
              required: '请输入密码',
              minlength: '密码长度不能小于 5 个字母',
              equalTo: '两次密码输入不一致'
            }
          }
        })
      },

      bind() {
        const fm = this
        $('.login-tabs').on('click', 'a', function (e) {
          fm.status = +e.target.dataset.index
        })

        $('#login').click(function () {
          console.log('login')
          fm.formValidate()
        })

        $('#register').click(function () {
          console.log('register')
          fm.formValidate()
        })

        $('.login-logo').click(function () {
          location.href = '/'
        })
      }
    }
    $(function () {
      form.init()
    })
  })
})

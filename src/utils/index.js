define({
  /**
   * 判断是不是IOS
   * @returns {Boolean}
   */
  isIos() {
    const u = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(u)) {
      return true
    } else {
      return false
    }
  },

  /**
   * 解析url字符串返回对象
   * @param {String} url 当前URL地址
   * @returns {Object} 所有参数
   */
  getUrlkey: function (url) {
    const params = {}
    const urls = url.split('?')
    if (urls.length > 1) {
      const arr = urls[1].split('&')
      for (let i = 0, l = arr.length; i < l; i++) {
        const a = arr[i].split('=')
        params[a[0]] = a[1]
      }
      return params
    } else {
      return {}
    }
  },

  /**
   * 图片转base64
   * @param {string} imgUrl 图片路径
   * @param {funtion} cb 回调函数
   * @param {string} url
   */
  getBase64: function (imgUrl, cb, type = 'base64') {
    window.URL = window.URL || window.webkitURL
    const xhr = new XMLHttpRequest()
    xhr.open('get', imgUrl, true)
    // 至关重要
    xhr.responseType = 'blob'
    xhr.onload = function () {
      if (this.status === 200) {
        // 得到一个blob对象
        const blob = this.response
        //  至关重要
        const oFileReader = new FileReader()
        oFileReader.onloadend = function (e) {
          const base64 = e.target.result

          if (type === 'base64') cb(base64)
          // 作为背景
        }
        oFileReader.readAsDataURL(blob)
        const src = window.URL.createObjectURL(blob)
        if (type === 'blob') cb(src)
      }
    }
    xhr.send()
  },

  /**
   * @description 函数节流
   * @param { Function } fn 需要节流的函数
   * @param { Number } t 节流时间，多久以后执行一次方法 单位ms
   * @return { Function } 已节流的函数
   * */
  throttle(fn, t = 1000) {
    if (typeof fn !== 'function') {
      console.log('in throttle,first argument must be Function')
      return
    }
    const _fn = fn
    let time = null
    let first = true
    return function () {
      const arg = arguments
      const _this = this
      if (first) {
        _fn.apply(_this, arg)
        first = false
        return
      }
      if (time) return
      time = setTimeout(function () {
        setTimeout(time)
        time = null
        _fn.apply(_this, arg)
      }, t)
    }
  },

  /**
   * @description 函数防抖
   * @param { Function } fn 需要防抖的函数
   * @param { Number } t 防抖时间 单位ms
   * @return { Function }
   */
  debounce(fn, t = 1000) {
    if (typeof fn !== 'function') {
      console.log('in debounce,first argument must be Function')
      return
    }
    let time

    return function () {
      const arg = arguments

      if (time) {
        clearTimeout(time)
        time = null
        return
      }
      time = setTimeout(() => {
        fn.apply(this, arg)
        time = null
      }, t)
    }
  },

  /**
   * 验证是不是电话号码
   * @param {string} val 串/号码
   * @return {Boolean}
   */
  isPhone(val) {
    var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/ // 手机号码
    var isMob = /^0?1[3|4|5|7|8][0-9]\d{8}$/ // 座机格式
    if (isMob.test(val) || isPhone.test(val)) {
      return true
    } else {
      return false
    }
  },

  /**
   * @description 时间格式化
   * @param { Date } 时间
   * @param { String } 格式，默认'yyyy-MM-dd hh:mm:ss'
   * @return { String } 格式化后的时间
   */
  dateFormat(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
    const o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds() // 毫秒
    }

    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length)
      )
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  },

  /**
   * 数组去重
   * @param {Object} array 需要去重的数组
   * @return {Object} 数组
   */
  dedupe(array) {
    return Array.from(new Set(array))
  },

  /**
   * 本地存储管理
   */
  storage: {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        // error
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key)
      } catch (error) {
        // error
      }
    },
    get(key) {
      try {
        return JSON.parse(localStorage.getItem(key))
      } catch (error) {
        // error
      }
    },
    clear() {
      try {
        localStorage.clear()
      } catch (error) {
        // error
      }
    }
  },
  /**
   * 数字分段切片
   * @param {Array} arr 原数组
   * @param {Number} size 分段大小
   * @returns {Array} 新数组
   */
  chunkArray(arr, size) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i + size)
    )
  }
})

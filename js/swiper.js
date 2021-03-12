;(function ($) {
  class Swiper {
    constructor(
      container,
      { auto = true, pagination = true, navigation = true } = {}
    ) {
      if (!container) throw new Error('swiper container must be provided!')
      this.container = $(container)
      this.width = this.container.width()
      this.length = this.container.find('.swiper-slide').length + 1
      this._idx = 0
      this.auto = auto
      this.pagination = pagination
      this.navigation = navigation
      this.timer = null
      this.flag = false
      this.init()
    }

    get idx() {
      return this._idx
    }

    set idx(v) {
      this._idx = v
      this.highlightPagination()
    }

    init() {
      this.initWidth()
      this.pagination && this.initPagination()
      this.navigation && this.initNavigation()
      this.bindEvents()
      this.idx = 0
      this.auto && this.autoPlay()
    }

    bindEvents() {
      const swiper = this
      $('.btn-next').click(() => {
        this.goNext()
      })

      $('.btn-prev').click(() => {
        this.goPrev()
      })

      this.pagination &&
        this.container.find('.dot').click(function () {
          swiper.move((swiper.idx = $(this).index()), 700)
        })

      this.auto &&
        this.container.mouseenter(() => {
          this.pause()
        })

      this.auto &&
        this.container.mouseleave(() => {
          this.autoPlay()
        })
    }

    initWidth() {
      this.container
        .find('.swiper-slide:first')
        .clone(true)
        .appendTo(this.container.find('.swiper-wrapper'))
      this.container.find('.swiper-slide').width(this.width)
      this.container.find('.swiper-wrapper').width(this.width * this.length)
    }

    initPagination() {
      $('.swiper-pagination').append(
        Array.from({ length: this.length - 1 }, x =>
          $('<span class="dot"></span>')
        )
      )
    }

    move(x, duration = 0) {
      this.container.find('.swiper-wrapper').animate(
        {
          left: -x * this.width
        },
        duration
      )
    }

    goPrev() {
      console.log('prev')
      if (this.flag) {
        return
      }
      this.flag = true
      setTimeout(() => {
        this.flag = false
      }, 700)

      if (this.idx === 0) {
        this.move(this.length - 1)
        setTimeout(() => {
          this.move(this.length - 2, 700)
          this.idx = this.length - 2
        }, 0)
      } else {
        // this.idx--
        this.move(--this.idx, 700)
      }
    }

    goNext() {
      console.log('next')
      if (this.flag) {
        return
      }
      this.flag = true
      setTimeout(() => {
        this.flag = false
      }, 700)
      this.idx++
      if (this.idx > this.length - 2) {
        this.idx = 0
        this.move(this.length - 1, 700)
        setTimeout(() => {
          this.move(0)
        }, 700)
      } else {
        this.move(this.idx, 700)
      }
    }

    initNavigation() {
      this.container.find('.swiper-control').show()
    }

    highlightPagination() {
      this.container.find('.dot').each((i, ele) => {
        if (i === this.idx) {
          $(ele).addClass('active').siblings().removeClass('active')
        }
      })
    }

    pause() {
      if (this.timer) {
        clearInterval(this.timer)
      }
    }

    autoPlay() {
      this.timer = setInterval(() => {
        this.goNext()
      }, 1500)
    }
  }
})(window.jQuery)

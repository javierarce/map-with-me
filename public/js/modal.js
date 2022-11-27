class Modal {
  constructor () {
    this.className = this.constructor.name
  }

  template () {
    return `
    <div class="Modal__backdrop js-backdrop"></div>
    <div class="Modal__inner has-transition js-inner"></div>
    `
  }

  hide () {
    this.$el.classList.remove('is-visible')

    setTimeout(() => {
      this.$el.remove()
    }, 300)
  }

  onClickOutside (e) {
    if (e.target.className.includes('js-backdrop')) {
      window.bus.emit(`hide-${this.className.toLowerCase()}`)
    }
  }

  render () {
    let className = this.className

    this.$el = createElement({ className })
    let html = ejs.render(this.template())

    this.$el.insertAdjacentHTML('beforeend', html)

    this.$backdrop = this.$el.querySelector('.js-backdrop')
    this.$backdrop.onclick = this.onClickOutside.bind(this)

    setTimeout(() => {
      this.$el.classList.add('is-visible')
    }, 10)

    return this.$el
  }
}

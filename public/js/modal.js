class Modal {
  constructor () {
    this.className = this.constructor.name
  }

  template () {
    return `
    <div class="Modal__backdrop"></div>
    <div class="Modal__inner has-transition js-inner"></div>
    `
  }

  hide () {
    this.$el.classList.remove('is-visible')

    setTimeout(() => {
      this.$el.remove()
    }, 300)
  }

  onClickOutside () {
    console.log(this.constructor.name)
    window.bus.emit(`hide-${this.className.toLowerCase()}`)
  }

  onClickInside (e) {
    if (e.target && e.target.tagName !== 'A') {
      killEvent(e)
    }
  }

  render () {
    let className = this.className

    this.$el = createElement({ className })
    let html = ejs.render(this.template())

    this.$el.insertAdjacentHTML('beforeend', html)
    this.$el.onclick = this.onClickOutside.bind(this)

    this.$inner = this.$el.querySelector('.js-inner')
    this.$inner.onclick = this.onClickInside.bind(this)

    setTimeout(() => {
      this.$el.classList.add('is-visible')
    }, 10)

    return this.$el
  }
}

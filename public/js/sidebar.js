class Sidebar {
  constructor () {
    this.bindEvents()
  }

  bindEvents () {
    window.bus.on(config.ACTIONS.ADD_MARKER, this.onAddLocation.bind(this))
    window.bus.on(config.ACTIONS.SELECT_MARKER, this.onSelectMarker.bind(this))
  }

  template () {
    return `<div class="Sidebar__content js-content"></div>`
  }

  onAddLocation (data) {
    let location = new Location(data)
    this.$content.prepend(location.render().$el)
  }

  onSelectMarker () {
  }

  render () {
    this.$el = createElement({ className: 'Sidebar'})
    this.$el.insertAdjacentHTML('beforeend', this.template())
    this.$content = this.$el.querySelector('.js-content')
    return this.$el
  }
}

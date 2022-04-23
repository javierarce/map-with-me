class Settings extends Modal {
  constructor () {
    super()
  }

  template () {
    return `
    <div class="Modal__backdrop"></div>
    <div class="Settings__inner has-transition js-inner">
      <div class="Settings__content no-bottom-padding">
        <div class="Settings__spinner Spinner is-small" v-if="isSaving"></div>

        <div class="Settings__form">
          <h3 class="Settings__sectionTitle">Configure your map</h3>

          <label for="title">
            <strong class="Input__label">Title</strong>
            <div class="Input__field Settings__field">
              <input id="title" type="text" class="Input" placeholder="Title">
            </div>
          </label>
          <div class="Settings__section">
            <div class="Settings__sectionContent">

              <label for="default_search_location">
                <strong class="Input__label">Search location</strong>
                <div class="Input__field Settings__field">
                  <input id="default_search_location" type="text" class="Input" placeholder="Default location">
                </div>
              </label>

              <label for="lon">
                <strong class="Input__label">Longitude</strong>
                <div class="Input__field Settings__field is-small">
                  <input id="lon" type="text" class="Input" placeholder="Longitude">
                </div>
              </label>

              <label for="lat">
                <strong class="Input__label">Latitude</strong>
                <div class="Input__field Settings__field is-small">
                  <input id="lat" type="text" class="Input" placeholder="Latitude">
                </div>
              </label>

              <label for="zoom">
                <strong class="Input__label">Zoom level</strong>
                <div class="Input__field Settings__field is-small is-small">
                  <input id="zoom" type="text" class="Input" placeholder="Zoom">
                </div>
              </label>

            </div>
          </div>

          <label for="admin">
            <strong class="Input__label">Admin username</strong>
            <div class="Input__field Settings__field is-medium">
              <input id="admin" type="text" class="Input" placeholder="Admin">
            </div>
          </label>

          <div class="Settings__section">
            <strong class="Input__label">Publication settings</strong>

            <div class="Settings__sectionContent">
              <label for="anonymous">

                <div class="Input__field Input__checkbox Settings__field">
                  <input id="anonymous" type="checkbox"> 
                  <p>
                    <strong class="Input__title">Anonymous</strong> 
                    <div class="Tooltip">?<span class="Tooltip__text">Login is not required</span></div>
                  </p>
                </div>
              </label>

              <label for="moderated">
                <div class="Input__field Input__checkbox Settings__field">
                  <input id="moderated" type="checkbox"> <p>
                      <strong class="Input__title">Moderated</strong> 
                    <div class="Tooltip">?  <span class="Tooltip__text">Submissions require approval</span></div>
                  </p>
                </div>
              </label>

              <label for="protected">
                <div class="Input__field Input__checkbox Settings__field">
                  <input id="protected" type="checkbox"> 
                  <p><strong class="Input__title">Protected</strong> 
                    <div class="Tooltip">?<span class="Tooltip__text"> Map is read-only</span></div>
                  </p>
                </div>
              </label>
            </div>
            <transition name="fade">
            <div class="Settings__hint" v-if="showModerationHint">Visit {{currentURL}}admin/SECRET to manage the submissions.</div>
            </transition>
          </div>

          <div class="Settings__buttons">
            <div class="Settings__sectionContent">
              <div class="Input__field Settings__field">
                <input type="text" class="Input" placeholder="Secret">
              </div>
              <button class="Button is-bold" @click="onClickSaveConfig" :class="saveButtonClass">Save configuration</button>
            </div>
          </div>
        </div>

        <div class="Settings__footer">
          <div>After changing this configuration, please restart the server.</div> 
        </div>
      </div>
      <div class="Settings__dangerZone">
        <div class="Settings__dangerZoneContent">
          Do you want to start again? <button class="Button is-link" @click="onClickDestroy">Destroy the database</button>
        </div>
      </div>
    </div>
`
  }
}

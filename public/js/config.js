const config = {
  TEXTS: {
    PLACEHOLDER: 'What\'s cool about this place?',
    SEARCH_PLACEHOLDER: 'Search for a place or an address',
    NO_RESULTS_TITLE:  'Oh, no… we couldn’t find "{q}."',
    NO_RESULTS_DESCRIPTION: `<p><strong>Map with Me</strong> uses data from <a href="https://www.openstreetmap.org">OpenStreetMap</a> 
  (a collaborative project which aims to create a free editable map of the world) and that place hasn’t been added yet.</p>
  <p>But the good news is that you can add it to OSM yourself and help improve a free and open map of the world! Visit <a href="https://www.openstreetmap.org">OSM</a>, zoom to an area, and click "edit".</p>`,
  },
  ACTIONS: {
    ADD_LOCATION: 'add-location',
    ADD_LOCATIONS: 'add-locations',
    CLOSE_POPUP: 'close-popup',
    REMOVE_MARKER: 'remove-marker',
    REMOVE_LOCATION: 'remove-location',
    RELOAD_MAP: 'reload-map',
    ADD_MARKER: 'add-marker',
    ADD_MARKERS: 'add-markers',
    INVALIDATE_MAP_SIZE: 'invalidate-size',
    LOGGED_IN: 'logged-in',
    LOGIN: 'login',
    ON_LOAD: 'on-load',
    SELECT_MARKER: 'select-marker',
    SELECT_LOCATION: 'select-location',
    SET_VIEW: 'set-view',
    SHOW_ADDED_LOCATION: 'show-added-location',
    SHOW_DEFAULT_POINT: 'show-default-point',
    SHOW_SAVED_LOCATION: 'show-saved-location',
    START_LOADING: 'start-loading',
    STOP_LOADING: 'stop-loading',
    SHOW_SETTINGS: 'show-settings',
    HIDE_SETTINGS: 'hide-settings',
    SHOW_ABOUT: 'show-about',
    HIDE_ABOUT: 'hide-about',
    TOGGLE_DESTROY: 'toggle-destroy',
    TOGGLE_ALERT: 'toggle-alert',
    TOGGLE_MAP_SIZE: 'toggle-map-size',
    VISIT_MARKER: 'visit-marker'
  },
  /* BE CAREFUL WHEN CHANGING THESE SETTINGS */
  ENDPOINTS: {
    ADD: '/api/add',
    REMOVE: '/api/remove',
    APPROVE: '/api/approve',
    REJECT: '/api/reject',
    LOCATIONS: '/api/locations',
    SAVE: '/api/save',
    STATUS: '/api/status',
    CONFIG: '/api/config',
    RECREATE_DB: '/api/recreate',
    NOMINATIM: 'https://nominatim.openstreetmap.org',
    LOGIN_PATH: '/auth/twitter',
    LOGOUT_PATH: '/auth/logout',
    GEOCODE_URL: '/reverse.php',
    SEARCH_URL: '/search.php',
    SEARCH_DETAILS_URL: '/details.php'
  }
}

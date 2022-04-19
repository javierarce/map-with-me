const config = {
  MAP: {
    DEFAULT_SEARCH_LOCATION: "",
    LAT: "39",
    LNG: "-37",
    ZOOM: "4",
    FIT_BOUNDS: false
  },

  ADMIN: {
    TITLE: 'Map with me your favorite places',
    ADMIN_USERNAME: 'javier',
    MODERATED: false,
    PROTECTED: false,
    ANONYMOUS: false
  },

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
    REMOVE_MARKER: 'remove-marker',
    ADD_MARKER: 'add-marker',
    ADD_MARKERS: 'add-markers',
    INVALIDATE_MAP_SIZE: 'invalidate-size',
    LOGGED_IN: 'logged-in',
    LOGIN: 'login',
    ON_LOAD: 'on-load',
    SELECT_MARKER: 'select-marker',
    SET_VIEW: 'set-view',
    SHOW_ADDED_LOCATION: 'show-added-location',
    SHOW_DEFAULT_POINT: 'show-default-point',
    SHOW_SAVED_LOCATION: 'show-saved-location',
    START_LOADING: 'start-loading',
    STOP_LOADING: 'stop-loading',
    TOGGLE_DESTROY: 'toggle-destroy',
    TOGGLE_ABOUT: 'toggle-about',
    TOGGLE_CONFIG: 'toggle-config',
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
    GEOCODE_URL: '/reverse.php',
    SEARCH_URL: '/search.php',
    SEARCH_DETAILS_URL: '/details.php'
  }
}
const regexp = /(?:[#*0-9]\uFE0F?\u20E3|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26AA\u26B0\u26B1\u26BD\u26BE\u26C4\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0-\u26F5\u26F7\u26F8\u26FA\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B55\u3030\u303D\u3297\u3299]\uFE0F?|[\u261D\u270C\u270D](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?|[\u270A\u270B](?:\uD83C[\uDFFB-\uDFFF])?|[\u23E9-\u23EC\u23F0\u23F3\u25FD\u2693\u26A1\u26AB\u26C5\u26CE\u26D4\u26EA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF\u2B50]|\u26F9(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|\u2764\uFE0F?(?:\u200D(?:\uD83D\uDD25|\uD83E\uDE79))?|\uD83C(?:[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]\uFE0F?|[\uDF85\uDFC2\uDFC7](?:\uD83C[\uDFFB-\uDFFF])?|[\uDFC3\uDFC4\uDFCA](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDFCB\uDFCC](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uDFF3\uFE0F?(?:\u200D(?:\u26A7\uFE0F?|\uD83C\uDF08))?|\uDFF4(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDC73\uDB40\uDC63\uDB40\uDC74|\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)?)|\uD83D(?:[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]\uFE0F?|[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD74\uDD90](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?|[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEDD-\uDEDF\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uDC08(?:\u200D\u2B1B)?|\uDC15(?:\u200D\uD83E\uDDBA)?|\uDC3B(?:\u200D\u2744\uFE0F?)?|\uDC41\uFE0F?(?:\u200D\uD83D\uDDE8\uFE0F?)?|\uDC68(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDC68\uDC69]\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE])))?))?|\uDC69(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?[\uDC68\uDC69]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?))|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFE])))?))?|\uDC6F(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDD75(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDE2E(?:\u200D\uD83D\uDCA8)?|\uDE35(?:\u200D\uD83D\uDCAB)?|\uDE36(?:\u200D\uD83C\uDF2B\uFE0F?)?)|\uD83E(?:[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5\uDEC3-\uDEC5\uDEF0\uDEF2-\uDEF6](?:\uD83C[\uDFFB-\uDFFF])?|[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDDDE\uDDDF](?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCC\uDDD0\uDDE0-\uDDFF\uDE70-\uDE74\uDE78-\uDE7C\uDE80-\uDE86\uDE90-\uDEAC\uDEB0-\uDEBA\uDEC0-\uDEC2\uDED0-\uDED9\uDEE0-\uDEE7]|\uDD3C(?:\u200D[\u2640\u2642]\uFE0F?|\uD83C[\uDFFB-\uDFFF])?|\uDDD1(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?))?|\uDEF1(?:\uD83C(?:\uDFFB(?:\u200D\uD83E\uDEF2\uD83C[\uDFFC-\uDFFF])?|\uDFFC(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFD-\uDFFF])?|\uDFFD(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])?|\uDFFE(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFD\uDFFF])?|\uDFFF(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFE])?))?))/g
class Bus {
  constructor ($el) {
    this.$el = $el
    this.events = []
    this.markers = []
    this.user = undefined
  }

  isLoggedIn () {
    return !!(this.user && this.user.username)
  }

  isAdmin () {
    return !!(this.user && this.user.username && config.ADMIN.ADMIN_USERNAME === this.user.username)
  }

  getTitle () {
    return config.ADMIN.TITLE
  }

  getAdminUsername () {
    return config.ADMIN.ADMIN_USERNAME
  }

  isModerated () {
    return config.ADMIN.MODERATED
  }

  isAnonymous () {
    return config.ADMIN.ANONYMOUS
  }

  isProtected () {
    return config.ADMIN.PROTECTED
  }

  findMarkerById (id) {
    let found = undefined

    for (let i = 0; i < this.markers.length; i++) {
      let marker = this.markers[i]

      if (id ===  marker.options.location.id) {
        found =  marker
        break
      }
    }

    return found
  }

  on (name, callback) {
    this.$el.addEventListener(name, (e) => {
      callback && callback(e.detail)
    })
  }

  emit (name, data) {
    let event = undefined

    if (data) {
      event = new CustomEvent(name, { detail: data })
    } else {
      event = new Event(name)
    }

    this.events.push(event)
    this.$el.dispatchEvent(event)
  }
}

class Locations {
  constructor () {
  }

  get () {
    return get(config.ENDPOINTS.LOCATIONS)
      .then(this.onGetLocations.bind(this))
      .catch((error) => {
        console.error(error)
      })
  }

  onGetLocations (response) {
    return response.json().then((result) => {
      this.locations = result.locations
      window.bus.emit(config.ACTIONS.ADD_LOCATIONS, this.locations)
    })
  }

  add ({ coordinates, name, description, address }) {
    post(config.ENDPOINTS.ADD, { coordinates, name, description, address })
      .then(this.onGetAddedLocation.bind(this))
      .catch((error) => {
        console.error(error)
      })
  }

  onGetAddedLocation (response) {
    response.json().then((result) => {
      window.bus.emit(config.ACTIONS.SHOW_ADDED_LOCATION, result)
    })
  }
}
class Location {
  constructor (data) {
    console.log(data)
    this.location = data.location
    this.user = data.location.user
    this.marker = data.marker

    this.isActive = false
    this.username = this.user && this.user.username
  }

  template () {

    return `
      <button :data-id="${this.location.id}" class="Locations__item" class="">
        <div class="Locations__itemName">${this.location.name}</div>
        <div class="Locations__itemDescription">${this.location.description}</div>
        <div class="Locations__itemAddress">${this.location.address}</div>
          <% if (showFooter) { %>
        <div class="Locations__itemFooter">
          <div class="Locations__itemUser">@<%= username %></div>
          <div class="Locations__itemFooterOptions">

          <% if (showApproveItem) { %>
            <button class="Locations__itemApprove js-approve"><%= approveLabel %></button>
            <% } %>
          <% if (showRemoveItem) { %>
            <button class="Locations__itemRemove js-remove">delete</button>
          <% } %>
          </div>
          <% } %>
        </div>
      </button>
    `
  }

  showFooter () {
    return this.showApproveItem(this.location || this.user)
  }

  showApproveItem () {
    return window.bus.isModerated() && (window.bus.isLoggedIn() && window.bus.user.username === window.bus.getAdminUsername() && !this.isMyMarker())
  }

  showRemoveItem () {
    return window.bus.isLoggedIn() && (this.isMyMarker() || window.bus.isAdmin())
  }

  getApproveLabel () {
    return this.location.approved ? 'reject' : 'approve'
  }

  isMyMarker () {
    return this.user ? (this.user.username === window.bus.user.username) : false
  }

  onClickRemove (e) {
    killEvent(e)

    let confirmation = confirm('Are you sure you want to delete this location?')

    if (confirmation) {
      let location = this.location

      this.post(config.ENDPOINTS.REMOVE, { location })
        .then(this.onRemoveLocation.bind(this))
        .catch((error) => {
          console.log(error)
        })
    }
  }

  onToggleApprove (response) {
    response.json().then((result) => {
      if (result) {
        let marker = this.markers.find(marker => marker.options.location.id === result.id)
        marker.options.location.approved = result.approved

        if (result.approved) {
          marker.getElement().classList.remove('is-disabled')
        } else {
          marker.getElement().classList.add('is-disabled')
        }
      }
    })
  }

  onClick () {
    //if (this.isActive) {
      //return
    //}

    this.activateMarker()
    console.log()
    window.bus.emit(config.ACTIONS.VISIT_MARKER, this.marker)
  }

  activateMarker () {
    this.isActive = true

    let classes = this.itemClass()

    if (classes) {
      this.$el.classList.add(classes)
    }
  }

  onSelectMarker (marker) {
    this.activateMarker()

    let $item = this.getItemById(marker.options.location.id) 
    $item.scrollIntoView({ behavior: 'smooth' })
  }

  removeMarker (id) {
    window.bus.emit(config.ACTIONS.REMOVE_MARKER, id)
  }

  isMarkerRejected () {
    return !this.location.approved
  }

  itemClass () {
    let classes = []

    if (this.isActive) {
      classes.push('is-active')
    }

    if (window.bus.isAdmin() && this.isMarkerRejected()) {
      classes.push('is-rejected')
    }

    return classes.join(' ')
  }

  render () {
    this.$el = createElement({ className: 'Location'})
    let html = ejs.render(this.template(), { username: this.username, showFooter: this.showFooter(), showApproveItem: this.showApproveItem(), showRemoveItem: this.showRemoveItem(), approveLabel: this.getApproveLabel() })
    this.$el.insertAdjacentHTML('beforeend', html)
    let classes = this.itemClass()

    if (classes) {
      this.$el.classList.add(classes)
    }

    this.$el.onclick = this.onClick.bind(this)

    return this
  }
}
const killEvent = (e) => {
  e.stopPropagation()
  e.preventDefault()
}

const truncate = (text, length = 100) => {
  if (!text) {
    return
  }

  return text.length > length ? `${text.substring(0, length)}...` : text
}

const extractNumber = (text) => {
  let matches = text.match(/^(\d+|[a-z])\./)
  return matches && matches[1]
}

const extractEmojis = (text) => {
  let emojis = []
  let match

  while (match = regexp.exec(text)) {
    emojis.push(match[0])
  }

  return emojis
}

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
}

const createElement = ({ className, html, text, elementType = 'div', type,  ...options }) => {
  let $el = document.createElement(elementType)

  if (type) {
    $el.type = 'text'
  }

  if (html) {
    $el.innerHTML = html
  } else if (text) {
    $el.innerText = text
  }

  className.split(' ').filter(c => c).forEach(name => $el.classList.add(name))

  if (!isEmpty(options)) {
    Object.keys(options).forEach((key) => {
      $el[key] = options[key]
    })
  }

  return $el
}
const addClass = (elementClass, className) => {
  let $element = getElement(`.${elementClass}`)

  if ($element) {
    $element.classList.add(className)
  }
}

const get = (URL, content) => {
  const headers = { 'Content-Type': 'application/json' }
  const method = 'GET'
  const options = { method, headers }

  return fetch(URL, options)
}

const post = (URL, content) => {
  const headers = { 'Content-Type': 'application/json' }
  const method = 'POST'
  const body = JSON.stringify(content)
  const options = { method, headers, body }

  return fetch(URL, options)
}

const getRandomItem = (items) => {
  return items[Math.floor(Math.random()*items.length)]
}

const getElements = (selector) => {
  return document.querySelectorAll(selector)
}

const getElement = (selector) => {
  return document.querySelector(selector)
}

const showLoader = () => {
  addClass('js-loader', 'is-visible')
}

const hideLoader = () => {
  const $loader = getElement('.js-loader')
  $loader.classList.remove('is-visible')
}

const enableSubmitButton = () => {
  const $button = getElement('.js-send')
  $button.classList.remove('is-disabled')
}

const disableSubmitButton = () => {
  const $button = getElement('.js-send')

  if ($button) {
    $button.classList.add('is-disabled')
  }
}

const detectMobile = () => {
window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
}
const MAX_TITLE_LENGTH = 80
const GEOCODING_EXTRA_PARAMS = '&addressdetails=1&namedetails=1&extratags=1&zoom=18&format=json'


class Popup {
  constructor (coordinates, options) {
    this.enableSend = false
    this.coordinates = coordinates
    this.geocode = options.geocode || false
    this.name = options.name
    this.description = options.description
    this.user = options.user
    this.address = options.address
    this.zoom = options.zoom
    this.readonly = options.readonly

    this.bindEvents()
    this.render()

    if (this.geocode) {
      this.startGeocoding()
    }
  }

  bindEvents () {
    window.bus.on(config.ACTIONS.START_LOADING, this.onStartLoading.bind(this))
    window.bus.on(config.ACTIONS.STOP_LOADING, this.onStopLoading.bind(this))
  }

  startLoading () {
    this.el.getContent().classList.add('is-loading')
  }

  stopLoading () {
    this.el.getContent().classList.remove('is-loading')
  }

  onStartLoading () {
    this.el.getContent().classList.add('is-loading')
  }

  onStopLoading () {
    this.el.getContent().classList.remove('is-loading')
  }

  enableSendButton () {
    if (this.el && this.el.getContent()) {
      this.el.getContent().classList.add('can-send')
      this.enableSend = true
    }
  }

  disableSendButton () {
    if (this.el && this.el.getContent()) {
      this.el.getContent().classList.remove('can-send')
      this.enableSend = false
    }
  }

  addLocation () {
    if (!this.enableSend) {
      return
    }

    window.bus.emit(config.ACTIONS.START_LOADING)

    let coordinates = this.coordinates
    let name = this.getName()
    let description = this.getDescription()
    let address = this.getAddress()

    window.bus.emit(config.ACTIONS.ADD_LOCATION, { coordinates, name, description, address })
  }

  showSuccess () {
    this.el.getContent().classList.add('was-successful')

    setTimeout(() => {
      this.hideSuccess()
    }, 1500)
  }

  hideSuccess () {
    this.el.getContent().classList.remove('was-successful')
  }

  focus () {
    setTimeout(() => {
      this.el.getContent().querySelector('.js-description').focus()
    }, 500)
  }

  startGeocoding () {
    window.bus.emit(config.ACTIONS.START_LOADING)
    this.setName('Geocoding…')
    this.setAddress('Geocoding…')

    let lat = this.coordinates.lat
    let lng = this.coordinates.lng

    let URL = `${config.ENDPOINTS.NOMINATIM}${config.ENDPOINTS.GEOCODE_URL}?lat=${lat}&lon=${lng}${GEOCODING_EXTRA_PARAMS}`

    get(URL)
      .then(this.onGetGeocoding.bind(this))
      .catch((error) => {
        console.error(error)
      })
  }

  onGetGeocoding (response) {
    response.json().then((result) => {
      window.bus.emit(config.ACTIONS.STOP_LOADING)

      let address = (result && this.parseAddress(result.address)) || result.display_name
      let name = (result.namedetails && result.namedetails.name) || address || result.display_name

      this.setName(truncate(name, MAX_TITLE_LENGTH))
      this.setAddress(address)
      this.focus()
    })
  }

  removeOrderFromText (text) {
     return text.replace(/^(\d+|[a-z])\./, '').trim()
  }
  
  parseAddress(address) {
    let parts = []

    let tpl = 'road, house_number, city, country'

    tpl.split(', ').forEach((part) => {
      if (address && address[part]) {
        parts.push(address[part])
      }
    })

    return parts.length ? parts.join(', ') : 'Mysterious location'
  }

  setName (text) {
    this.el.getContent().querySelector('.js-name').textContent = text
  }

  setAddress (text) {
    this.el.getContent().querySelector('.js-address').textContent = text
    this.el.getContent().classList.add('has-address')
  }


  getName () {
    return this.el.getContent().querySelector('.js-name').textContent
  }

  getDescription () {
    return this.el.getContent().querySelector('.js-description').value
  }

  getAddress () {
    return this.el.getContent().querySelector('.js-address').textContent
  }

  login () {
    this.startLoading()

    let address = this.getAddress()
    let coordinates = this.coordinates
    let description = this.getDescription()
    let name = this.getName()
    let zoom = this.zoom

    window.bus.emit(config.ACTIONS.LOGIN, { coordinates, zoom, name, description, address })
  }

  render () {
    let classNames = []

    if (window.bus.isLoggedIn()) {
      classNames.push('is-logged')
    } 

    if (this.description && this.description.length){
      classNames.push('can-send')
    }

    if (this.readonly) {
      classNames.push('is-readonly')
    }

    if (this.address || window.bus.isLoggedIn()) {
      classNames.push('has-address')
    }

    let className = 'Popup'

    this.el = L.popup({
      className
    })

    let content = L.DomUtil.create('div', `Popup__content ${classNames.join(' ')}`)

    let header = L.DomUtil.create('div', 'Popup__header js-name', content)

    if (!this.readonly) {
      header.contentEditable='true'
    }

    header.innerHTML = this.name

    let body = L.DomUtil.create('div', 'Popup__body', content)

    if (!window.bus.isAnonymous() && this.user) {
      let footer = L.DomUtil.create('div', 'Popup__footer', content)

      let user = L.DomUtil.create('a', 'Popup__user', footer)
      user.href= `https://twitter.com/${this.user.username}`
      user.innerText = `@${this.user.username}`
    }

    let comment = L.DomUtil.create('div', 'Popup__comment', body)
    let controls = L.DomUtil.create('div', 'Popup__controls', body)

    L.DomUtil.create('div', 'Popup__spinner Spinner', body)
    L.DomUtil.create('div', 'Popup__success', body)

    let description = L.DomUtil.create('div', 'Popup__description js-comment', comment)

    if (this.description) {
      description.innerText = this.removeOrderFromText(this.description)
    }

    let textarea = L.DomUtil.create('textarea', 'Popup__input js-description', comment)
    textarea.setAttribute('placeholder', config.TEXTS.PLACEHOLDER)

    textarea.onkeyup = (e) => {

      e = e || window.event

      if (e.keyCode === 27) {
        window.bus.emit('close-popup')
      }

      let description = this.getDescription()

      if (description.length > 0) {
        this.enableSendButton()
      } else {
        this.disableSendButton()
      }
    }

    if (this.description && this.description.length) {
      textarea.innerText = this.description
      window.bus.emit('enable-send-button')
    }

    let btn = L.DomUtil.create('button', 'Button Popup__button', controls)
    btn.setAttribute('type', 'button')

    let showAddLocation = (window.bus.isLoggedIn() || window.bus.isAnonymous())

    btn.innerHTML = showAddLocation ? 'Add location' : 'Log in with Twitter'
    btn.onclick =  showAddLocation ? this.addLocation.bind(this) : this.login.bind(this)

    let address = L.DomUtil.create('div', 'Popup__address js-address', body)

    if (this.address) {
      address.innerText = this.address
    }

    this.el.setContent(content)

    return this.el
  }
}

class Map {
  constructor () {
    this.bindEvents()
    this.render()

    this.expanded = false
    this.readonly = undefined
    this.coordinates = undefined
    this.options = {}
    this.marker = undefined
  }

  bindEvents () {
    window.bus.on('close-popup', this.closePopup.bind(this))
    window.bus.on(config.ACTIONS.ADD_LOCATIONS, this.onAddLocations.bind(this))

    window.bus.on(config.ACTIONS.REMOVE_MARKER, this.onRemoveMarker.bind(this))
    window.bus.on(config.ACTIONS.INVALIDATE_MAP_SIZE, this.invalidateSize.bind(this))
    window.bus.on(config.ACTIONS.SET_VIEW, this.onSetView.bind(this))
    window.bus.on(config.ACTIONS.SHOW_ADDED_LOCATION, this.onShowAddedLocation.bind(this))
    window.bus.on(config.ACTIONS.SHOW_DEFAULT_POINT, this.showDefaultPoint.bind(this))
    window.bus.on(config.ACTIONS.SHOW_SAVED_LOCATION, this.showSavedLocation.bind(this))
    window.bus.on(config.ACTIONS.VISIT_MARKER, this.onVisitMarker.bind(this))
  }

  bindMapEvents () {
    this.map.on('zoomend', this.onZoomEnd.bind(this))
    this.map.on('popupopen', this.onPopupOpen.bind(this))
    this.map.on('click', this.onMapClick.bind(this))
  }

  toggle () {
    this.expanded = !this.expanded

    window.bus.emit(config.ACTIONS.TOGGLE_MAP_SIZE, this.expanded)
    this.toggleControl.getContainer().classList.toggle('is-expanded')

    setTimeout(() => {
      window.bus.emit(config.ACTIONS.INVALIDATE_MAP_SIZE)
    }, 200)
  }

  createToggleExpand (opts) {
    return new L.Control.ToggleExpand(opts)
  }

  createZoomOut (opts) {
    return new L.Control.ZoomOut(opts)
  }

  startLoading () {
    window.bus.emit(config.ACTIONS.START_LOADING)
  }

  stopLoading () {
    window.bus.emit(config.ACTIONS.STOP_LOADING)
  }

  setDescription (text) {
    document.body.querySelector('.js-description').value = text

    if (text && text.length) {
      this.enableSendButton()
    }
  }

  addLocations (locations) {
    locations.forEach(this.addMarker.bind(this)) 
    window.bus.emit(config.ACTIONS.ON_LOAD)
    this.map.addLayer(this.cluster)
  }

  flattenCoordinates (coordinates) {
    return [coordinates.lat, coordinates.lng]
  }

  addMarker (location) {
    if (!location.lat && !location.lng) {
      return
    }

    let coordinates = { lat: location.lat, lng: location.lng }
    let latlng = this.flattenCoordinates(coordinates) 

    let name = location.name
    let description = location.description
    let user = location.user
    let address = location.address
    let zoom = this.map.getZoom()

    this.popup = new Popup(coordinates, { name, description, user, address, readonly: true, zoom })

    let emojis = extractEmojis(description)
    let number = extractNumber(description)

    let icon = this.getIcon({ emojis, number, location })
    let marker = L.marker(latlng, { icon, location })

    marker.on('click', () => {
      window.bus.emit(config.ACTIONS.SELECT_MARKER, marker)
    })

    marker.bindPopup(this.popup.el, { maxWidth: 'auto' })

    window.bus.emit(config.ACTIONS.ADD_MARKER, { location, marker })

    this.cluster.addLayer(marker)
    window.bus.markers.push(marker)
  }

  bindKeys () {
    document.onkeydown = (e) => {
      e = e || window.event

      if (e.keyCode === 27) {
        this.removeMarker()
      }
    }
  }

  onVisitMarker (marker) {
    let location = marker.getLatLng()
    let latlng = [ location.lat, location.lng ]

    this.map.setView(latlng, 20, { animate: true, easeLinearity: .5, duration: 0.250 })
    setTimeout(() => {
        marker.fire('click')
    }, 500)
  }

  onSetView (result) {
    this.removeMarker()

    this.coordinates = { lat: result.lat, lng: result.lon }
    let latlng = this.flattenCoordinates(this.coordinates)

    let name = result.display_name.split(',')[0]
    let address = (result && this.parseAddress(result.address)) || undefined

    this.popup = new Popup(latlng, { name, address })
    let icon = this.getIcon({})

    this.marker = L.marker(latlng, { icon }).bindPopup(this.popup.el, { maxWidth: 'auto' }).addTo(this.map)
    this.marker.openPopup()
    this.map.setView(latlng, result.zoom)
  }

  parseAddress(address) { // TODO: remove duplication
    let parts = []

    let tpl = 'road, house_number, city, country'

    tpl.split(', ').forEach((part) => {
      if (address && address[part]) {
        parts.push(address[part])
      }
    })

    return parts.length ? parts.join(', ') : 'Mysterious location'
  }

  getIcon ({ location, emojis, number }) {
    let html = ''

    let classNames = [ 'icon' ]

    if (location && !location.approved && window.bus.isModerated()) {
      classNames.push('is-disabled')
    }

    if (number) {
      html = number
      classNames.push('has-order')
    } else if (emojis && emojis.length) {
      html = emojis[0]
      classNames.push('has-emoji')
    }

    let className = classNames.join(' ')

    return new L.divIcon({
      className,
      html,
      iconSize: [32, 32],
      iconAnchor: new L.Point(16, 0)
    })
  }

  onMapClick (e) {
    if (this.removeMarker()) {
      return
    }

    this.coordinates = e.latlng
    this.openPopup()
  }

  closePopup () {
    this.map.closePopup()
  }

  removeMarker () {
    this.closePopup()

    if (this.marker) {
      this.marker.remove()
      this.marker = undefined
      return true
    }
  }

  invalidateSize () {
    this.map.invalidateSize(true)
  }

  openPopup (name, description, options = {}) {
    let zoom = this.map.getZoom()
    let latlng = this.flattenCoordinates(this.coordinates)
    this.popup = new Popup(this.coordinates, {...options, geocode: true, name, description, zoom })

    let icon = this.getIcon({})
    this.marker = L.marker(latlng, { icon }).bindPopup(this.popup.el, { maxWidth: 'auto' }).addTo(this.map)
    this.marker.openPopup()
    this.map.setView(latlng)
  }

  addControls () {
    this.map.zoomControl.setPosition('topright')

    L.Control.ToggleExpand = L.Control.extend({
      onAdd: (map)  => {
        let div = L.DomUtil.create('div', 'ToggleControl')
        L.DomEvent.on(div, 'click', (e) => {
          killEvent(e)
          L.DomEvent.disableClickPropagation(div)
          this.toggle()
        })
        return div
      }
    })

    L.Control.ZoomOut = L.Control.extend({
      onAdd: (map)  => {
        let div = L.DomUtil.create('div', 'ZoomOutControl')
        L.DomEvent.on(div, 'click', (e) => {
          killEvent(e)
          L.DomEvent.disableClickPropagation(div)
          this.removeMarker()
          this.fitBounds()
        })
        return div
      }
    })

    this.toggleControl = this.createToggleExpand({ position: 'topright' }).addTo(this.map)
  }

  onZoomEnd () {
    let zoom = this.map.getZoom()

    if (zoom > 6) {
      if (!this.zoomOutControl) {
        this.zoomOutControl = this.createZoomOut({ position: 'topright' }).addTo(this.map)
      }
    } else {
      if (this.zoomOutControl) {
        this.zoomOutControl.remove()
        this.zoomOutControl = undefined
      }
    }
  }

  showDefaultPoint () {
    this.map.flyTo([config.MAP.LAT, config.MAP.LNG], config.MAP.ZOOM, {
      animate: true,
      duration: 1
    })
  }

  onShowAddedLocation (location) {
    this.stopLoading()
    this.removeMarker()

    let name = location.name
    let description = location.description
    let address = location.address
    let user = location.user
    let zoom = this.map.getZoom()

    let latlng = this.flattenCoordinates(this.coordinates)

    let options = { name, description, address, user, readonly: true , zoom }

    this.popup = new Popup(this.coordinates, options)

    let emojis = extractEmojis(description)
    let number = extractNumber(description)

    let icon = this.getIcon({ emojis, number })
    let marker = L.marker(latlng, { icon, location }).bindPopup(this.popup.el, { maxWidth: 'auto' }).addTo(this.map)

    window.bus.emit(config.ACTIONS.ADD_MARKER, { location, marker })
    marker.openPopup()

    this.popup.showSuccess()

    setTimeout(() => {
      this.popup.focus()
    }, 500)
  }

  showSavedLocation (data) {
    this.coordinates = { lat: data.lat, lng: data.lng }
    let latlng = this.flattenCoordinates(this.coordinates)

    let name = data.name
    let description = data.description
    let address = data.address

    this.popup = new Popup(this.coordinates, { name, description, address })

    let icon = this.getIcon({})

    this.marker = L.marker(latlng, { icon }).bindPopup(this.popup.el, { maxWidth: 'auto' }).addTo(this.map)
    this.marker.openPopup()
    this.map.setView(latlng, data.zoom)
  }

  onRemoveMarker (id) {
    let index = window.bus.markers.findIndex((item) => { 
      return item.options.location.id === id
    })

    if (index !== -1) {
      this.map.removeLayer(window.bus.markers[index])
      this.$delete(window.bus.markers, index)
    } else {
      console.error('Marker not found', window.bus.markers)
    }
  }

  onAddLocations (locations) {
    locations.forEach(this.addMarker.bind(this)) 
    window.bus.emit(config.ACTIONS.ON_LOAD)
    this.map.addLayer(this.cluster)
  }

  fitBounds () {
    let group = L.featureGroup(window.bus.markers)
    this.map.fitBounds(group.getBounds())
  }

  onPopupOpen (e) {
    setTimeout(() => {
      let px = this.map.project(e.popup._latlng)
      px.y -= e.popup._container.clientHeight/2 
      this.map.panTo(this.map.unproject(px),{ animate: true })
    }, 800)
  }

  render () {
    let options = { 
      scrollWheelZoom: true,
      zoomControl: true,
      maxBoundsViscosity: 1.0
    }

    this.map = L.map('map', options).setView([config.MAP.LAT, config.MAP.LNG], config.MAP.ZOOM)

    this.cluster = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false
    })

    this.addControls()

    this.bindMapEvents()

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'), {
      attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
      minZoom: 0
    }).addTo(this.map)
  }
}
class Header {
  constructor () {
    this.canLogin = false
    this.title = window.bus.getTitle()
    this.loggedIn = false
    this.username = undefined
    this.avatarURL = undefined
    this.canLogin = !window.bus.isAnonymous()
    this.unlogged = this.canLogin && this.loggedIn
    this.allowToLog = this.canLogin && !this.loggedIn

    this.bindEvents()
  }

  template () {
    return `
    <div class="Header__info">
      <button class="Button Header__title js-button">${this.title}</button>
      <Search />
    </div>
    <div class="Header__links js-links">
      <button class="Button Header__linksItem js-about">About</button>
      <button class="Button Header__linksItem js-config">Config</button>
    </div>
    `
  }

  bindEvents () {
    window.bus.on(config.ACTIONS.LOGGED_IN, this.onLoggedIn.bind(this))
  }

  onClickTitle () {
    window.bus.emit(config.ACTIONS.SHOW_DEFAULT_POINT)
  }

  onClickConfig () {
    window.bus.emit(config.ACTIONS.TOGGLE_CONFIG)
  }

  onClickAbout () {
    window.bus.emit(config.ACTIONS.TOGGLE_ABOUT)
  }

  onClickLogin () {
    if (window.bus.isLoggedIn()) {
      console.log('logout') // TODO
    } else {
      window.location.href = config.ENDPOINTS.LOGIN_PATH
    }
  }

  onLoggedIn () {
    this.loggedIn = window.bus.isLoggedIn()

    if (this.loggedIn) {
      this.avatarURL = window.bus.user.profileImage
      this.username = `@${window.bus.user.username}`
      this.$login.innerHTML = this.username

    }
  }

  render () {
    this.$el = createElement({ className: 'Header'})
    this.$el.insertAdjacentHTML('beforeend', this.template())

    this.$links = this.$el.querySelector('.js-links')

    this.$title = this.$el.querySelector('.js-button')
    this.$title.onclick = this.onClickTitle.bind(this)

    this.$login = createElement({ elementType: 'button', className: 'Button Header__linksItem', text: 'Log in' })
    this.$login.onclick = this.onClickLogin.bind(this)

    this.$links.appendChild(this.$login)

    return this.$el
  }
}

class Sidebar {
  constructor () {
    this.locations = []

    this.bindEvents()

  let people = ['geddy', 'neil', 'alex'];
  let html = ejs.render('<%= people.join(", "); %>', {people: people});
    console.log(html)
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
    this.locations.push(location)
    this.$content.appendChild(location.render().$el)
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
class App {
  constructor () {
    this.$el = getElement('.App')

    this.header = new Header()
    this.sidebar = new Sidebar()

    this.map = new Map()
    this.locations = new Locations()

    this.bindEvents()
    this.getStatus()
    this.render()
  }

  bindEvents () {
    window.bus.on(config.ACTIONS.ADD_LOCATION, this.onAddLocation.bind(this))
    window.bus.on(config.ACTIONS.LOGIN, this.onLogin.bind(this))
    window.bus.on(config.ACTIONS.ON_LOAD, this.onLoad.bind(this))
    window.bus.on(config.ACTIONS.START_LOADING, this.onStartLoading.bind(this))
    window.bus.on(config.ACTIONS.STOP_LOADING, this.onStopLoading.bind(this))
    window.bus.on(config.ACTIONS.TOGGLE_DESTROY, this.onToggleDestroy.bind(this))
    window.bus.on(config.ACTIONS.TOGGLE_ABOUT, this.onToggleAbout.bind(this))
    window.bus.on(config.ACTIONS.TOGGLE_CONFIG, this.onToggleConfig.bind(this))
    window.bus.on(config.ACTIONS.TOGGLE_ALERT, this.onToggleAlert.bind(this))
    window.bus.on(config.ACTIONS.TOGGLE_MAP_SIZE, this.onToggleMapSize.bind(this))

    document.onkeyup = this.onKeyUp
  }

  onLoad () {
    document.body.classList.add('is-loaded')
  }

  getStatus () {
    get(config.ENDPOINTS.STATUS)
      .then(this.onGetStatus.bind(this))
      .catch((error) => {
        console.error(error)
      })
  }

  onGetStatus (response) {
    response.json().then((result) => {
      if (!result && !result.user) {
        return
      }

      window.bus.user = result.user
      window.bus.emit(config.ACTIONS.LOGGED_IN)

      if (result.coordinates) {
        window.bus.emit(config.ACTIONS.SHOW_SAVED_LOCATION, result.coordinates)
      }

    this.locations.get()

    }).catch((error) => {
      console.error(error)
    })
  }

  onStartLoading () {
    console.log(1)
    document.body.classList.add('is-loading')
  }

  onStopLoading () {
    console.log(0)
    document.body.classList.remove('is-loading')
  }

  onToggleConfig () {
    this.showConfig = !this.showConfig
  }

  onToggleDestroy () {
    this.showDestroy = !this.showDestroy
  }

  onToggleAbout () {
    this.showAbout = !this.showAbout
  }

  onToggleAlert (title, description, footer) {
    this.showAlert = !this.showAlert
    this.alertTitle = title
    this.alertDescription = description
    this.alertFooter = footer
  }

  onToggleMapSize (value) {
    document.body.classList[value ? 'add' : 'remove']('is-expanded')
  }

  onAddLocation ({ coordinates, name, description, address }) {
    window.bus.emit(config.ACTIONS.START_LOADING)
    this.locations.add({ coordinates, name, description, address })
  }

  onLogin ({ coordinates, zoom, name, description, address }) {
    post(config.ENDPOINTS.SAVE, { coordinates, zoom, name, description, address }).then((response) => {
      window.location.href = config.ENDPOINTS.LOGIN_PATH
    })
  }

  render () {
    this.$el.appendChild(this.header.render())
    this.$el.appendChild(this.sidebar.render())
  }
}

window.onload = () => {
  window.bus = new Bus(document.body)
  new App()
}

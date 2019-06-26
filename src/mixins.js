import config from '../config'

const METHODS = {
  DELETE: 'DELETE',
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT'
}

const HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

export default {
  methods: {
    onError (e) {
      console.log('Error: ', e)
    },
    delete (url, body) {
      return window.fetch(url, {
        headers: HEADERS,
        method: METHODS.DELETE,
        body: JSON.stringify(body)
      })
    },
    put (url, body) {
      return window.fetch(url, {
        headers: HEADERS,
        method: METHODS.PUT,
        body: JSON.stringify(body)
      })
    },
    post (url, body) {
      return window.fetch(url, {
        headers: HEADERS,
        method: METHODS.POST,
        body: JSON.stringify(body)
      })
    },
    get (url) {
      return window.fetch(url, {
        headers: HEADERS,
        method: METHODS.GET
      })
    },
    coordinatesToLatLon (coordinates) {
      return [coordinates.lat, coordinates.lon]
    },
    latLonToCoordinates (latLon) {
      return { lat: latLon[0], lon: latLon[1] }
    },
    getDetails (id, data) {
      let url = `${config.ENDPOINTS.NOMINATIM}${config.ENDPOINTS.SEARCH_DETAILS_URL}?place_id=${id}&format=json`

      const onGetDetails = (response) => {
        this.onGetDetails(response, data)
      }

      this.get(url)
        .then(onGetDetails.bind(this))
        .catch((error) => {
          console.log(error)
        })
    },
    geocode (lat, lng, data) {
      let url = `${config.GEOCODE_URL}?lat=${lat}&lon=${lng}&zoom=18&format=json`

      let onGetGeocoding = (response) => {
        this.onGetGeocoding(response, data)
      }
      this.get(url)
        .then(onGetGeocoding.bind(this))
        .catch((error) => {
          console.log(error)
        })
    },
  }
}

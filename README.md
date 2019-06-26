# Map with Me

🌍 Create collaborative maps with your friends (and enemies) https://mapwithme.glitch.me


### Here's how to create a collaborative map of your own

1. If you haven't done it yet, remix the project by [clicking here](https://glitch.com/edit/#!/remix/mapwithme).
2. Open the `.env` file and add your Twitter credentials. Currently, Twitter is use as the identity verification mechanism, so you'll need to <a href="https://developer.twitter.com/en/apps">create a new app</a> first. 

Also, come up with a cool username and password for the database and replace `APP_NAME` with the name of your app on glitch:

```js
CONSUMER_KEY=
CONSUMER_SECRET=
DB_USER=
DB_PASS=
CALLBACK_URL=https://APP_NAME.glitch.me/auth/twitter/callback
```

3. Now open the glitch console and create a `recreate.txt` file (this will destroy and recreate the DB, but since there's no content yet this is totally fine). Also throw a `refresh` command in there:

```
touch recreate.txt
refresh
```

4. Configure your map editing the `config.js` file. Here are the most important configuration blocks: 

```js
const ADMIN = {
  ADMIN_USERNAME: 'javier', // the twitter username of the map admin
  MODERATED: false // if you set it to `true` the admin will need to approve every location 
}
``` 

```js
const MAP = {
  DEFAULT_SEARCH_LOCATION: 'Madrid, Spain', // this will restrict the geocoding requests to that city and country
  LAT: 40.416775, // default latitude of your map
  LON: -3.703790, // default longitude of your map
  ZOOM: 14 // default zoom level
}
```

```js
const TEXTS = {
  MAIN_TITLE: 'Madrid',
  DESCRIPTION_: 'This is a map of cool places around Madrid.'
}
```

### Everyone has issues

Yeah, please open an issue in this repo if you: 

1) Found a horrible bug :_(
2) Made a cool map you want to share with me :)

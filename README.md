# Map with Me

🌍 Create collaborative maps with your friends (and enemies).

### Here's how to create a collaborative map of your own

1. If you haven't done it yet, remix the project by [clicking here](https://glitch.com/edit/#!/remix/mapwithme).
2. Open the `.env` file and add your Twitter credentials (currently, Twitter is used as the identity verification mechanism, so you'll need to <a href="https://developer.twitter.com/en/apps">create a new app</a> first).

Also, come up with a cool username and password for the database and replace `APP_NAME` with the name of your app on glitch:

```js
CONSUMER_KEY=
CONSUMER_SECRET=
DB_USER=
DB_PASS=
CALLBACK_URL=https://APP_NAME.glitch.me/auth/twitter/callback
```

3. Visit your website and click 'Config'. A configuration form will appear so you can change the default map settings (longitude, latitude, default search location, and zoom level)

4. Configure your map editing the `config.js` file. 

```js
const ADMIN = {
  ADMIN_USERNAME: 'javier', // the Twitter username of the map admin without the @ symbol
  MODERATED: false // if you set it to `true` the admin will need to approve every place manually 
  PROTECTED: false // if you set it to `true` users won't be able to submit places
}
``` 

### Everyone has issues

Yeah, so please open an issue in this repo if you: 

1) Found a horrible bug :(
2) Made a cool map you want to share with me :)


### TODO

[Check out the development of this project](https://github.com/javierarce/map-with-me/projects/1)

# Map with Me

🌍 Create collaborative maps with your friends (and enemies).

### Here's how to create a collaborative map of your own

1. If you haven't done it yet, remix the project by [clicking here](https://glitch.com/edit/#!/remix/mapwithme).
2. Open the `.env` file out the variables:

```js
CONSUMER_KEY=     // If you want to use Twitter as an authentication mechanism
CONSUMER_SECRET=  // you'll need to create an app and add the credentials here (optional)

CALLBACK_URL=https://APP_NAME.glitch.me/auth/twitter/callback 

DB_USER= // Username for your database
DB_PASS= // Password for your database

SECRET= // You'll need this to update your  map configuration or recreate the database
```

3. Visit your website and click 'Config'. A configuration form will appear so you can change the default map and publishing settings.

### Everyone has issues

Yeah, so please open an issue in this repo if you: 

1) Found a horrible bug :(
2) Made a cool map you want to share with me :)


### TODO

[Check out the development of this project](https://github.com/javierarce/map-with-me/projects/1)

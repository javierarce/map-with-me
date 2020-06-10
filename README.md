# Map with Me

🌍 Create collaborative maps with your friends (and enemies).

### Here's how to create a collaborative map of your own

1. Open the `.env` file out the variables:

```js
DB_USER= // Username for your database
DB_PASS= // Password for your database

SECRET= // You'll need this to update your  map configuration or recreate the database
```

If you want to use Twitter as an authentication mechanism you'll need to create an app and add the credentials:

```js
CONSUMER_KEY=     
CONSUMER_SECRET= 
CALLBACK_URL=https://APP_NAME.glitch.me/auth/twitter/callback 
```

2. Visit your website and click 'Config'. A configuration form will appear so you can change the default map and publishing settings.

### Everyone has issues

Yeah, so please open an issue [in this repo](https://github.com/javierarce/map-with-me/issues) if you: 

1) Found a horrible bug :(
2) Made a cool map you want to share with me :)

### TODO

[Check out the development of this project](https://github.com/javierarce/map-with-me/projects/1)

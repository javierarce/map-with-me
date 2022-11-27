# Map with Me

🌍 Create collaborative maps with your friends (and enemies).

![alt text](https://javier.work/images/mapwithme/home.jpg)


### Here's how to create a collaborative map of your own

1. Open the `.env` file out the variables:

```js
DB_USER= // Username for your database
DB_PASS= // Password for your database

SECRET= // You'll need this to access the map settings
```

2. Install the dependencies with `yarn install`
3. Run the project with `yarn start`

Your map will be visible at `http://localhost:3000`


### How to update the map settings

There are two ways:

1. Editing the file `map.yaml`
2. Visiting `http://localhost:3000/admin/SECRET` (where `SECRET` is the password you defined in the first step of the installation)


### Using Twitter 

If you want to use Twitter as an authentication mechanism you'll need to create an app and add the credentials:

```js
CONSUMER_KEY=     
CONSUMER_SECRET= 
CALLBACK_URL=https://APP_NAME.glitch.me/auth/twitter/callback 
```


### Everyone has issues

Yeah, so please open an issue [in this repo](https://github.com/javierarce/map-with-me/issues) if you: 

1) Found a horrible bug :(
2) Made a cool map you want to share with me :)

### TODO

[Check out the development of this project](https://github.com/javierarce/map-with-me/projects/1)

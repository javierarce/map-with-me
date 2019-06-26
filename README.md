# Map with Me


https://mapwithme.glitch.me

---

Here's how to create a collaborative map of your own:

1. If you haven't done it yet, remix the project by [clicking here](https://glitch.com/edit/#!/remix/mapwithme).
2. Open the .`env` file and add your Twitter credentials. Currently, Twitter is use as the identity verification mechanism, so you'll need to <a href="https://developer.twitter.com/en/apps">create a new app</a> first. Come up with a cool username and password for the database and replace `APP_NAME` with the name of your app on glitch:

```
CONSUMER_KEY=
CONSUMER_SECRET=
DB_USER=
DB_PASS=
CALLBACK_URL=https://APP_NAME.glitch.me/auth/twitter/callback
```

3. Now open the glitch console and create a `recreate.txt` file (this will destroy and recreate the DB, but since there's no content yet this is totally fine), then hit `refresh`:

```
touch recreate.txt
refresh
```

4. Configure your map editing the `config.js` file.

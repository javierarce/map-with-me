# Map with Me


https://mapwithme.glitch.me


![Map with Me](screenshot.png "Map with Me")

---

Here's how to create a collaborative map of your own:

1. If you haven't done it yet, remix the project by [clicking here](https://glitch.com/edit/#!/remix/mapwithme).
2. Open the .`env` file and your Twitter credentials (you'll need to <a href="https://developer.twitter.com/en/apps">create a new app</a>), and a username and password for the database

```
CONSUMER_KEY=
CONSUMER_SECRET=
DB_USER=
DB_PASS=
CALLBACK_URL=https://APP_NAME.glitch.me/auth/twitter/callback
```

3. Open the glitch console and create a `recreate.txt` file (this will destroy and recreate the DB!), then hit `refresh`:

```
touch recreate.txt
refresh
```

4. Configure your map editing the `config.js` file.

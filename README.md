# The Collector
This is a Pokemon Card Collector, an application where you can search for pokemon cards and check information about them.



This application uses the <a href="https://pokemontcg.io/">Pokémon TCG API</a>. If you aren't using an API key, you are rate limited to 1000 requests a day, and a maxium of 30 per minute.
You can request a key for the API on the website <a href="https://pokemontcg.io/">Pokémon TCG API</a>, then just set the POKETCGAPI_KEY variable on the first line of the app.js file to your key.

```js
const POKETCGAPI_KEY = `YOUR_API_KEY_HERE`;
```

Just a reminder, this application is for personal use, your API key will not be hidden in the code, if you need to share the project with someone, remove your API key.

# Screenshots

On the homepage you can search for any pokemon card by its name or by part of its name.

<img src="https://i.imgur.com/bSqnGqf.jpg">

In response, you will receive a list of cards that match the searched name. The application will display the card's name, its number, its set, and the set series.

<img src="https://i.imgur.com/Clru6sB.jpg">

When clicking on any card, the application will display all the details and the transcript of all elements of that pokémon card.

<img src="https://i.imgur.com/seB82UB.jpg">

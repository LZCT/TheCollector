// YOUR POKEMON TCG API KEY HERE
//If you aren’t using an API key, you are rate limited to 1000 requests a day, and a maxium of 30 per minute.
const POKETCGAPI_KEY = ``;




const fetchCard = () => {
   
    let cardName = document.getElementById('cardName').value; 

    // Make a request with the card name
    const url = `https://api.pokemontcg.io/v2/cards?q=name:${cardName}`;
    fetch(url, {
        method: "GET",
        withCredentials: true,
        headers: {
            "X-API-KEY": POKETCGAPI_KEY,
            "Content-Type": "application/json"
        }
    })
        .then( res => res.json())
        .then((cards) => {

            let arrayCards = [];
            
            cards.data.forEach( (card) => {
                //For each card resulting from the search, create an object with the id and image of the card and add it to an array
                const pokemon = {
                    id: card.id,
                    img: card.images.large
                };
                arrayCards.push(pokemon);                
            });     
            //Call the function to list all cards
            listCards(arrayCards); 
            
        })
};


//Creates a div with an id linked to the card's id and displays the card's image
const listCards = (pokemon) => {
    const cardList = document.getElementById("cardList");
    const listOfImages =  pokemon.map( (card) => 
        `
        <div class="card" onclick="pokemonInfo('${card.id}')">
            <img class="card-image" src="${card.img}" id="${card.id}"/>
        </div>
        `
    ).join('');
    
    cardList.innerHTML = listOfImages;

};

const pokemonInfo = (id) => {
    console.log(id);

}








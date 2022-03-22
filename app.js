// YOUR POKEMON TCG API KEY HERE
//If you aren’t using an API key, you are rate limited to 1000 requests a day, and a maxium of 30 per minute.
const POKETCGAPI_KEY = ``;

const cardList = document.getElementById("cardList");


class pokemonCard {
    constructor(name, type, img, set,){
        this._name = name;
        this._type = type;
        this._img = img;
        this._set = set;

    }
};



const fetchCard = () => {
   
    let cardName = document.getElementById('cardName').value; 

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

            let arrayCardsImages = []
            
            cards.data.forEach( (card) => {
                
                arrayCardsImages.push(card.images.large)
                
            });     
            
            listCards(arrayCardsImages);

            
        })
            
    
};



const listCards = (card) => {
    
    const listOfImages =  card.map( (cardImg) => 
        `
        <div class="card">
            <img class="card-image" src="${cardImg}"/>
        </div>
        `
    ).join('');

    cardList.innerHTML = listOfImages;

};








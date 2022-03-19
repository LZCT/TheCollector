// YOUR POKEMON TCG API KEY HERE
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
    console.log(`CONSOLE: ${cardName}`)

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
            console.log(cards.data)

            let arrayCardsImages = []
            
            cards.data.forEach( (card) => {
                console.log(card.name);

               arrayCardsImages.push(card.images.large)
               
                //const img = new Image(300,420);
                //img.src = card.images.large;
                //document.body.appendChild(img);
            });     
           // document.getElementById("preview-card").src = card[0].data.images.small;
            for(let i= 0; i < arrayCardsImages.length; i++){
                console.log(arrayCardsImages[i]);
            }
            
            listCards(arrayCardsImages);

            
        })
            

    document.getElementById("txt").value = cardName;
    
};



const listCards = (card) => {
    
    const listOfImages =  card.map( (cardImg) => 
        `
        <li class="card">
        <img class="card-image" src="${cardImg}"/>
        <li>
        `
    ).join('');

    

    cardList.innerHTML = listOfImages;

};








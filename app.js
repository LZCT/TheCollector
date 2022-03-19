// YOUR POKEMON TCG API KEY HERE
const POKETCGAPI_KEY = ``;

class Pokemon {
    constructor(name, type, img, set,){}
}



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
            const arrayCardsImages = []
            
            cards.data.forEach( (card) => {
                console.log(card.name);

                arrayCardsImages.push(card.images.large)

                const img = new Image(300,420);
                img.src = card.images.large;
                document.body.appendChild(img);
            });     
           // document.getElementById("preview-card").src = card[0].data.images.small;
            
        })
            

    document.getElementById("txt").value = cardName;
    
}


const teste = () => {
    console.log("Funciona");
}








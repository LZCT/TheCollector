// YOUR POKEMON TCG API KEY HERE
//If you aren’t using an API key, you are rate limited to 1000 requests a day, and a maxium of 30 per minute.
const POKETCGAPI_KEY = ``;


const cardList = document.getElementById("cardList");

const fetchCard = () => {
   
    let cardName = document.getElementById('cardName').value; 

    // Make a request with the card name
    const url = `https://api.pokemontcg.io/v2/cards?q=name:${cardName}`;
    fetch(url, {
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
    
    const listOfImages =  pokemon.map( (card) => 
        `
        <div class="card" onclick="pokemonInfo('${card.id}')">
            <img class="card-image" src="${card.img}" id="${card.id}"/>
        </div>
        `
    ).join('');
    
    cardList.innerHTML = listOfImages;

};

// Show more information about a pokemon in a popup
const pokemonInfo = async (id) => {
    const url = `https://api.pokemontcg.io/v2/cards/${id}`;

    fetch(url, {
        withCredentials: true,
        headers: {
            "X-API-KEY": POKETCGAPI_KEY,
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then((card) => {
        console.log(card.data);
        displayPokemon(card.data);
    })
    
}

// Function to display the information about the card
const displayPokemon = (card) =>{
    
    //Pokemon Object

    let Pokemon = {
        unlimited: card.legalities.unlimited,
        standard: card.legalities.standard,
        expanded: card.legalities.expanded,
        evolvesFrom: card.evolvesFrom

    }
    
    

    // Check Legalities
    if (typeof Pokemon.unlimited === "undefined"){
        Pokemon.unlimited = "Illegal";
    }
    if (typeof Pokemon.standard === "undefined"){
        Pokemon.standard = "Illegal";
    }
    if (typeof Pokemon.expanded === "undefined"){
        Pokemon.expanded = "Illegal";
    }

    const subtypes = card.subtypes.map((subtypes) => subtypes).join(', ');

    console.log(subtypes);

   

    const htmlString = 
        `<div class="pokemonPopUp">
            
            <img id="closeBtn" src="img/close.png" onclick="closePopUp()">
            
            
            <div class="pokemon">
                <div class="pokemonImg">
                    <p><img class="card-image" src="${card.images.large}"/>
                </div>

                <div class="pokemonName">
                    <h1>${card.supertype}</h1>
                    <h2>${card.name} (#${card.number}/${card.set.printedTotal})</h2>
                    <h4>${subtypes}</h4>
                </div>


                <div class="cardInfo">
                    
                    <p><mark class="title">Set:</mark> ${card.set.name} | <mark class="title">Series:</mark> ${card.set.series}
                    <br><br>
                    <p style="color:red;">Legalities<p>
                    <p>
                    <mark class="title">Standard:</mark> ${Pokemon.standard} |
                    <mark class="title">Expanded:</mark> ${Pokemon.expanded} | 
                    <mark class="title">Unlimited:</mark> ${Pokemon.unlimited}
                    
              
                
                </div>
      
            </div>
        </div>
        `

    cardList.innerHTML += htmlString;
    console.log(htmlString);
    
}


const closePopUp = () => {
    const popUp = document.querySelector(".pokemonPopUp");
    popUp.parentElement.removeChild(popUp);
}






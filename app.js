// YOUR POKEMON TCG API KEY HERE
//If you aren’t using an API key, you are rate limited to 1000 requests a day, and a maxium of 30 per minute.
const POKETCGAPI_KEY = ``;

// Get some HTML Elements
const cardList = document.getElementById("cardList");
const cardNameInput = document.getElementById("cardNameInput");
const searchBox = document.querySelector(".search-box");
const searchResult = document.getElementById("searchResult");








// Function to search when press Enter
cardNameInput.addEventListener("keydown", function(event) {
  // "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("searchButton").click();
  }
});



const fetchCard = () => {

    cardList.hidden = true;
    searchResult.hidden = false;
    
   
    let cardName = cardNameInput.value; 

    // Make a request with the card name
    const url = `https://api.pokemontcg.io/v2/cards?q=name:"${cardName}*"`;

    searchResult.innerHTML =  `<h2> Searching for<mark class="title">${cardName}</mark></h2>
    <div class="spinner-border text-danger" role="status">
    <span class="visually-hidden">Loading...</span>
    </div>`;
    cardNameInput.value = "";

    fetch(url, {
        withCredentials: true,
        headers: {
            "X-API-KEY": POKETCGAPI_KEY,
            "Content-Type": "application/json"
        }
    })
        .then( res => {
            if(res.ok)
                return res.json();
            
            searchResult.innerHTML = "<h2>Something went wrong! Try again later!</h2>";  
            throw new Error('Request failed!!');

        })
        .then((cards) => {
            //Check if the search returns any card
            if(cards.count == 0)
                return searchResult.innerHTML = `<h2>Your search for <mark class="title">${cardName}</mark> returned no results!</h2>`;
            
            let arrayCards = [];
            
            cards.data.forEach( (card) => {
                //For each card resulting from the search, create an object with the id and image of the card and add it to an array
                const pokemon = {
                    id: card.id,
                    name: card.name,
                    number: card.number,
                    printedTotal: card.set.printedTotal,
                    set: card.set.name,
                    series: card.set.series,
                    img: card.images.large
                };
                arrayCards.push(pokemon);                
            });     
            //Call the function to list all cards
            listCards(arrayCards); 
            searchResult.hidden = true;
        })
};


//Creates a div with an id linked to the card's id and displays the card's image
const listCards = (pokemon) => {
    
    const listOfImages =  pokemon.map( (card) => 

    `<div class="card text-white bg-dark mb-3 h-100" >
        <div class="card-header bg-transparent"> <p class="card-text text-warning">${card.name}</p> (#${card.number}/${card.printedTotal})</div>
        <img src="${card.img}" id="card-image" class="card-img-top"  onclick="pokemonInfo('${card.id}')">
        <div class="card-body">
            <p class="card-text text-warning">SERIES</p>
            <p class="card-text">${card.series}</p>
            <p class="card-text text-warning">SET</p>
            <p class="card-text">${card.set}</p>
        </div>
    </div>`

      
    ).join('');
    
    
    cardList.innerHTML = listOfImages;
    cardList.hidden = false;
    cardList.scrollIntoView({behavior: 'smooth'});

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
        displayPokemon(card.data);
    })
    
}

// Function to display the information about the card
const displayPokemon = (card) =>{
    
   
    // Checking Legalities
    let Legalities = {
        unlimited: card.legalities.unlimited,
        standard: card.legalities.standard,
        expanded: card.legalities.expanded
    }

    if (typeof Legalities.unlimited === "undefined"){
        Legalities.unlimited = "Illegal";
    }
    if (typeof Legalities.standard === "undefined"){
        Legalities.standard = "Illegal";
    }
    if (typeof Legalities.expanded === "undefined"){
        Legalities.expanded = "Illegal";
    }

 
    // Layout Popup
    const htmlString = 
        `<div class="pokemonPopUp">
            
            <div class="pokemon">

                <div class="pokemonImg">
                    <p><img id="card-image" src="${card.images.large}"/>
                </div>


                <div class="pokemonName">
                    <button type="button" class="btn-close btn-close-white" aria-label="Close" onclick="closePopUp()"></button>
                    
                    <h1>${card.supertype}</h1>
                </div>

                <div class="setInfo">
                    <h2>Collection</h2>
                    <p><mark class="title">Rarity:</mark>  ${card.rarity}
                    <p><mark class="title">Illustrator:</mark> ${card.artist}
                    <p><mark class="title">Series:</mark> ${card.set.series} | <mark class="title">Set:</mark> ${card.set.name}
                    <p><img class="symbol" src="${card.set.images.symbol}"/>
                    
                    <h2>Legalities</h2>
                    <p>
                    <mark class="title">Standard:</mark> ${Legalities.standard} |
                    <mark class="title">Expanded:</mark> ${Legalities.expanded} | 
                    <mark class="title">Unlimited:</mark> ${Legalities.unlimited}
                </div>

                <div class="cardInfo">
                    
                </div>
            
            </div>
        </div>
        `

    cardList.innerHTML += htmlString;
    
    // Selecting some HTML content
    const cardInfo = document.querySelector(".cardInfo");
    const pokemonName = document.querySelector(".pokemonName");
    const setInfo = document.querySelector(".setInfo");

    
    // Checking and Showing Card Type and HP, Card Name and Card Number
    if(typeof card.types != "undefined"){
        let pokemonType = card.types.map((type) => 
            `<img  src="img/types/${type}.webp"/>`
        )
        
        let type =  `<h2>${pokemonType}&emsp;${card.name} (#${card.number}/${card.set.printedTotal})`;

        if(typeof card.hp != undefined)
            type +=  `<br>${card.hp}hp</h2>`;
        
        pokemonName.innerHTML += type;
   
    }
    
        

    // Checking and Showing Card Subtype and Evolves From
    if(typeof card.subtypes != "undefined"){
        
        let subtypes = card.subtypes.map((subtypes) => subtypes).join(', ');
        
        if (typeof card.evolvesFrom != "undefined")
            pokemonName.innerHTML += `${subtypes} | Evolves from: ${card.evolvesFrom}`;
        else
            pokemonName.innerHTML += `${subtypes}`;
        
        
    }


    // Checking if a card has rules
    if(typeof card.rules != "undefined"){
        let listOfRules = `<h2>Rules</h2>`;
        
        listOfRules += card.rules.map( (rule) => 
           `<p>&#9658;${rule}`
       
        ).join("<br>")
        
        cardInfo.innerHTML += listOfRules;
    };
        
    // Checking if a Pokemon has an ability and showing it
    if(typeof card.abilities != "undefined"){
        let listOfAbilities = "<h2>Abilities</h2>";

        listOfAbilities +=  card.abilities.map( (ability) => 
            `
            <p><mark class="title">${ability.name} | ${ability.type}</mark>  
            <p>${ability.text}
            `
        )

        cardInfo.innerHTML += listOfAbilities;

    };

    // Checking if a card has attacks and showing it
    if(typeof card.attacks != "undefined"){
        let listOfAttacks = "<h2>Attacks</h2>";
        
        card.attacks.map( (attack) => {

            let atkCost = attack.cost.map((cost) =>
            `<img  src="img/types/${cost}.webp"/>`
            ).join("")
            
        
            listOfAttacks +=  `<p><mark class="attackDmg">${atkCost}&emsp;</mark> 
                <mark class="title">${attack.name}&emsp;
                </mark><mark class="attackDmg">${attack.damage}</mark>  
                <p>${attack.text}
            `
        })

        cardInfo.innerHTML += listOfAttacks;
    };

    //Checking weaknesses, retreat cost, resistance
    if(card.supertype == "Pokémon"){

        let listOfWeaknesses = "<h2>Weakness: ";
        let retreatCost = "<h2>Retreat Cost: ";
        let listOfResistances = "<h2>Resistances: ";

        if(typeof card.weaknesses != "undefined"){
            
            let weakType = card.weaknesses.map ((weak) => 
                `<img  src="img/types/${weak.type}.webp"/> ${weak.value}`
            ).join("");
            
            listOfWeaknesses += weakType + "</h2>";
        }
        
        if(typeof card.retreatCost != "undefined"){
            
            let retreatType = card.retreatCost.map ((retreat) => 
                `<img  src="img/types/${retreat}.webp"/>`
            ).join("");
            
            retreatCost += retreatType + "</h2>";
        }

        if(typeof card.resistances != "undefined"){
            
            let resistanceType = card.resistances.map ((resistance) => 
                `<img  src="img/types/${resistance.type}.webp"/> ${resistance.value}`
            );
            
            listOfResistances += resistanceType + "</h2>";
        }
        
        setInfo.innerHTML += listOfWeaknesses + retreatCost + listOfResistances;
    }
    

    
}

// Function to close the Pokemon Card Popup
const closePopUp = () => {
    const popUp = document.querySelector(".pokemonPopUp");
    popUp.parentElement.removeChild(popUp);
}






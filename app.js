// YOUR POKEMON TCG API KEY HERE
//If you aren’t using an API key, you are rate limited to 1000 requests a day, and a maxium of 30 per minute.
const POKETCGAPI_KEY = ``;

// Get some HTML Elements
const cardList = document.getElementById("cardList");
const cardNameInput = document.getElementById("cardNameInput");






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
   
    let cardName = cardNameInput.value; 

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

    }
    
    

    // Checking Legalities
    if (typeof Pokemon.unlimited === "undefined"){
        Pokemon.unlimited = "Illegal";
    }
    if (typeof Pokemon.standard === "undefined"){
        Pokemon.standard = "Illegal";
    }
    if (typeof Pokemon.expanded === "undefined"){
        Pokemon.expanded = "Illegal";
    }

 
    // Layout Popup
    const htmlString = 
        `<div class="pokemonPopUp">
            
            
            
            
            <div class="pokemon">
                <img id="closeBtn" src="img/close.png" onclick="closePopUp()">

                <div class="pokemonImg">
                    <p><img class="card-image" src="${card.images.large}"/>
                </div>

                <div class="pokemonName">
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
                    <mark class="title">Standard:</mark> ${Pokemon.standard} |
                    <mark class="title">Expanded:</mark> ${Pokemon.expanded} | 
                    <mark class="title">Unlimited:</mark> ${Pokemon.unlimited}
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

    
    // Checking and Showing Card Type and HP
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
        
    // Checking if a Pokemon has an ability and showing
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

    // Checking if a card has attacks and showing
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






// YOUR POKEMON TCG API KEY HERE
//If you aren’t using an API key, you are rate limited to 1000 requests a day, and a maxium of 30 per minute.
const POKETCGAPI_KEY = ``;

// Get some HTML Elements
const cardList = document.getElementById("cardList");
const cardNameInput = document.getElementById("cardNameInput");
const searchBox = document.querySelector(".search-box");
const searchResult = document.getElementById("searchResult");
const canvasCardInfo = document.querySelector(".canvasCardInfo-body");



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


//Function to Search for a Card using card name
const fetchCard = () => {

    cardList.hidden = true;
    searchResult.hidden = false;
    
   
    let cardName = cardNameInput.value; 

    //Check if the card name ends with a space and removing it
    if(cardName.endsWith(' ')){
        cardName = cardName.slice(0, -1);
    }

    // Make a request with the card name
    const url = `https://api.pokemontcg.io/v2/cards?q=name:"${cardName}*"`;

    searchResult.innerHTML =  
    `<h2> Searching for<mark class="title">${cardName}</mark></h2>
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


//Creates a div to display the card's image
const listCards = (pokemon) => {
    
    const listOfImages =  pokemon.map( (card) => 

    `<div class="card text-white bg-dark mb-3 h-100">
        <div class="card-header bg-transparent"> 
            <p class="card-text text-warning">${card.name}</p> 
            (#${card.number}/${card.printedTotal})
        </div>

        <a data-bs-toggle="offcanvas" href="#canvasCardInfo">
            <img src="${card.img}" id="card-image" class="card-img-top" onclick="pokemonInfo('${card.id}')">
        </a>
        
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


// Show more information about a card in a offcanvas
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
        console.log(card.data);
    })
    
}

//checkLegalities
//Function to check card legalities
const checkLegalities = (card) => {

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

    return Legalities;
}

// checkRules
// Function to check if a card has rules
const checkRules = (card) => {
     
    if(typeof card.rules != "undefined"){

        let listOfRules = card.rules.map( (rule) => 
           `<p>&#9658;${rule}`
       
        ).join("<br>");
        
        return listOfRules;
    };

    return false;
}

 // checkAbilities
// Function to check if a Pokemon has abilities
const checkAbilities = (card) => {
   
    if(typeof card.abilities != "undefined"){

        let listOfAbilities =  card.abilities.map( (ability) => 
            `
            <p><mark class="title">${ability.name} | ${ability.type}</mark>  
            <p>${ability.text}
            `
        )
        console.log("TESTE:" + listOfAbilities);
        return listOfAbilities;

    };

    return false;
}
// checkAncientTrait
// Function to check if a Pokemon has an ancient trait
const checkAncientTrait = (card) => {
   
    if(typeof card.ancientTrait != "undefined"){

        let ancientTrait = 
            `<p><mark class="title">${card.ancientTrait.name} </mark>
            <p>${card.ancientTrait.text}`;

        return ancientTrait;
    };

    return false;
}

// checkAttacks
// Function to check if a card has attacks
const checkAttacks = (card) => {
    
    if(typeof card.attacks != "undefined"){
        let listOfAttacks = "";
        card.attacks.map( (attack) => {

            let atkCost = attack.cost.map((cost) =>
            `<img  src="img/types/${cost}.webp"/>`
            ).join("");
            
            listOfAttacks +=  `<p><mark class="attackDmg">${atkCost}&emsp;</mark> 
                <mark class="title">${attack.name}&emsp;
                </mark><mark class="attackDmg">${attack.damage}</mark>  
                <p>${attack.text}
            `
        })

        return listOfAttacks;
    };

    return false;
}

// checkRetreatCost
// Function to check the retreat cost of a pokemon
const checkRetreatCost = (card) => {

    let retreatCost = " --- ";

    if(typeof card.retreatCost != "undefined"){
            
        let retreatType = card.retreatCost.map ((retreat) => 
            `<img  src="img/types/${retreat}.webp"/>`
        ).join("");

        retreatCost = retreatType;
    }

    return retreatCost;
}
// checkResistance
// Function to check the resistance of a pokemon
const checkResistance = (card) => {

    let listOfResistances = " --- ";

    if(typeof card.resistances != "undefined"){
            
        let resistanceType = card.resistances.map ((resistance) => 
            `<img  src="img/types/${resistance.type}.webp"/> ${resistance.value}`
        );
        
        listOfResistances = resistanceType;
    }

    return listOfResistances;
}

// checkWeakness
// Function to check the weakness of a pokemon
const checkWeakness = (card) => {

    let listOfWeaknesses = " --- ";

    if(typeof card.weaknesses != "undefined"){
        
        let weakType = card.weaknesses.map ((weak) => 
            `<img  src="img/types/${weak.type}.webp"/> ${weak.value}`
        ).join("");
        
        listOfWeaknesses = weakType;
    }
    
    return listOfWeaknesses;
}



// Function to display the information about the card
const displayPokemon = (card) =>{
    canvasCardInfo.innerHTML = "";
   
    
    
    // Checking Card Legalities
    let Legalities = checkLegalities(card);

 
    // Layout Canvas
    const htmlString = 
        ` 
        <div class="pokemon">

            <div class="pokemonName">                    
                <h1>${card.supertype}</h1>
            </div>

            <div class="pokemonImg">
                <p><img id="card-image" src="${card.images.large}"/>
            </div>

            <div class="setInfo">
                <h2>Collection</h2>
                <p><mark class="title">Rarity:</mark>  ${card.rarity}
                <p><mark class="title">Illustrator:</mark> ${card.artist}
                <p><mark class="title">Series:</mark> ${card.set.series} | <mark class="title">Set:</mark> ${card.set.name}
                <p><img class="symbol" src="${card.set.images.symbol}"/>
            </div>

            <div id="legalities">
                <h2>Legalities</h2>
                <p>
                <mark class="title">Standard:</mark> ${Legalities.standard} |
                <mark class="title">Expanded:</mark> ${Legalities.expanded} | 
                <mark class="title">Unlimited:</mark> ${Legalities.unlimited}
            </div>

            <div id="rules"></div>

            <div id="abilities"></div>

            <div id="attacks"></div>

            <div  id="ancientTrait"></div>

            <div id="weakness"></div>

            <div id="resistance"></div>
            
            <div id="retreatCost"></div>
            
            <div class="cardInfo"></div>
        
        </div>
        `
    canvasCardInfo.innerHTML += htmlString;
    
    
    // Selecting some HTML content
    const cardInfo = document.querySelector(".cardInfo");
    const pokemonName = document.querySelector(".pokemonName");
    const setInfo = document.querySelector(".setInfo");
    const pokemonImage = document.querySelector(".pokemonImg");

    const rulesDIV = document.getElementById("rules");
    const abilitiesDIV = document.getElementById("abilities");
    const attacksDIV = document.getElementById("attacks");
    const ancientTraitDIV = document.getElementById("ancientTrait");
    const weaknessDIV = document.getElementById("weakness");
    const resistanceDIV = document.getElementById("resistance");
    const retreatCostDIV = document.getElementById("retreatCost");

    //FLAVOR TEXT
    // Checking if the card has a flavor text
    if(typeof card.flavorText != "undefined"){
        pokemonImage.innerHTML += "<p>" + card.flavorText;
    }

    // CARD TYPE, CARD NAME, HP, CARD NUMBER
    // Checking and Showing Card Type and HP, Card Name and Card Number
    if(card.supertype == "Pokémon"){
        let pokemonType = card.types.map((type) => 
            `<img  src="img/types/${type}.webp"/>`
        ).join("");
        
        let nameInfo =  `<h2>${pokemonType} ${card.name} (#${card.number}/${card.set.printedTotal})<h2>`;

        if(typeof card.hp != undefined)
            nameInfo +=  `<h3>${card.hp}hp</h3>`;
        
        pokemonName.innerHTML += nameInfo;
   
    }else{
        let nameInfo = `<h2>${card.name} (#${card.number}/${card.set.printedTotal})`;
        pokemonName.innerHTML += nameInfo;
    }
    
    // SUBTYPE AND EVOLVES FROM
    // Checking and Showing Card Subtype and Evolves From
    if(typeof card.subtypes != "undefined"){
        
        let subtypes = card.subtypes.map((subtypes) => subtypes).join(', ');

        pokemonName.innerHTML += `${subtypes}`;
        
        if (typeof card.evolvesFrom != "undefined")
            pokemonName.innerHTML += ` | Evolves from: ${card.evolvesFrom}`;        
        
    }

    // CHECKING RULES
    listOfRules = checkRules(card);
    if(listOfRules){
        rulesDIV.innerHTML += "<h2>Rules</h2>" + listOfRules;
    };
    // CHECKING ABILITIES
    listOfAbilities = checkAbilities(card);
    if(listOfAbilities){
        abilitiesDIV.innerHTML += "<h2>Abilities</h2>" + listOfAbilities;
    };
    // CHECKING ANCIENT TRAIT
    ancientTrait = checkAncientTrait(card);
    if(ancientTrait){
        ancientTraitDIV.innerHTML += "<h2>Ancient Trait</h2>" + ancientTrait;
    }
    // CHECKING ATTACKS
    attacks = checkAttacks(card);
    if(attacks){
        attacksDIV.innerHTML += "<h2>Attacks</h2>" + attacks;
    }
    // CHECKING WEAKNESS, RESISTANCE, RETREAT COST
    if(card.supertype == "Pokémon"){
        weaknessDIV.innerHTML += "<h2>Weakness</h2>" + checkWeakness(card);
        resistanceDIV.innerHTML += "<h2>Resistances</h2>" + checkResistance(card);
        retreatCostDIV.innerHTML += "<h2>Retreat Cost</h2>" + checkRetreatCost(card);
    }  
    

    
}







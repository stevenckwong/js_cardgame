var currentCard = 0;
let cardDeck = initCardDeck()
let drawnCards = [];
startGame();
displayGameHistory();
// console.log(getCardHeightAndWidth());

// function to initialise the card deck
function initCardDeck() {
  const aDeck = []
  let cardType;

  for (let x=0; x<4; x++) {
    switch (x) {
      case 0: {cardType = 'Hearts';break;};
      case 1: {cardType = 'Diamonds';break;};
      case 2: {cardType = 'Clubs';break;};
      case 3: {cardType = 'Spades';break;};
    }

    for (let i=1; i<14; i++) {
      let cardName;
      if (i < 10) {
        cardName = '0'+i+'-'+cardType;
      } else {
        cardName = i+'-'+cardType;
      }
      let cardVal;
      if (i > 10) {
        cardVal = 10;
      } else {
        cardVal = i;
      }
      let card = {
        'name': cardName,
        'value': cardVal,
      }
      aDeck.push(card);
    }
  }

  return aDeck;

}

// function clear the history of games from storage
function clearHistoryClick(e) {
  const gameHistoryCollection = document.querySelector('.collection');
  localStorage.removeItem('games');
  const noOfChildElements = gameHistoryCollection.childElementCount;
  console.log(`No of Child Elements: ${noOfChildElements}`);
  for (let i = 0; i < noOfChildElements ;i++) {
    // deleting element 0 all the time because the index reduces as the nodes
    // are removed from the collection
    gameHistoryCollection.removeChild(gameHistoryCollection.children[0]);
  }  
  // Hide winning panel
  document.getElementById('winnerPanel').style.display = 'none';
}

// function display game history
function displayGameHistory() {
  const gameHistoryCollection = document.querySelector('.collection');
  
  for (let i = 0; i < gameHistoryCollection.childElementCount;i++) {
    gameHistoryCollection.removeChild(gameHistoryCollection.children[0]);
  }
  // console.log(gameHistoryCollection)

  let games = localStorage.getItem('games');
  if (games === null) {
    return;
  }
  let gamesArr = JSON.parse(games);
  gamesArr.forEach(function(game){
    addEntryToGameHistoryDisplay(game);
  });
}

// Adds an entry to the game history list displayed
function addEntryToGameHistoryDisplay(game) {
  const gameHistoryCollection = document.querySelector('.collection');

  let entry = document.createElement('li');
  entry.setAttribute('class', 'collection-item');
  if  (game.winner === 'Dealer') {
    entry.innerText = `Winner: ${game.winner} || Winning Cards: ${game.dealercards} || Losing Cards: ${game.playercards}`;
  } else if (game.winner === 'Player') {
    entry.innerText = `Winner: ${game.winner} || Winning Cards: ${game.playercards} || Losing Cards: ${game.dealercards}`;
  } else {
    entry.innerText = `Draw || Dealer Cards: ${game.dealercards} || Player Cards: ${game.playercards} `;
  }
  // gameHistoryCollection.appendChild(entry);
  gameHistoryCollection.insertBefore(entry,gameHistoryCollection.firstChild)
}

// randomly generate 2 cards and return them in an array
function drawCard(){

  let noOfCardsDrawn = 0;
  let cards = [];
  
  while (noOfCardsDrawn < 2) {
    let randomCardIndex = Math.floor((Math.random()*52)); // returns a value between 0 and 51
    // if the random card index has not been drawn before, draw it, then add the index to the 
    // list of drawn cards, and draw another. Stop drawing once we have drawn 2 cards
    if (drawnCards.indexOf(randomCardIndex) === -1) {
      cards.push(cardDeck[randomCardIndex]);
      drawnCards.push(randomCardIndex);
      noOfCardsDrawn += 1;
    } 

  }
  console.log(drawnCards);
  return cards;
}

function startGame(e) {
  const cardDimensions = getCardHeightAndWidth();
  
  const cardBackHTML = `<img src="cards/00-back.png" width="${cardDimensions[1]}" height="${cardDimensions[0]}"/>`;

  // re initialise the deck
  drawnCards = [];
  currentCard = 0;
  const displayCards = document.querySelectorAll('.card-content'); 

  for (let i = 0; i < 6; i++) {
    displayCards[i].innerHTML = cardBackHTML;  
  }
  
  // Change button functionality to draw new cards.
  document.getElementById('drawCardBtn').innerText = 'Draw Card'
  document.getElementById('drawCardBtn').removeEventListener('click',startGame);
  document.getElementById('drawCardBtn').addEventListener('click',drawCardClick);
  document.getElementById('clearHistoryBtn').addEventListener('click',clearHistoryClick);

  // Hide winning panel
  document.getElementById('winnerPanel').style.display = 'none';
  
}

function getWinner() {
  let games = localStorage.getItem('games');
  let gamesArr;
  if (games === null) {
    gamesArr = [];
  } else {
    gamesArr = JSON.parse(games);
  }

  const displayCards = document.querySelectorAll('.card-content'); 

  // Total up dealer cards - the first 3 of the array
  let dealerTotal = 0;
  const dealerCards = []
  for (let i = 0; i < 3; i++) {
    // dealerTotal = dealerTotal + parseInt(displayCards[i].innerText);  
    // dealerCards.push(displayCards[i].innerText);
    let cardValue = displayCards[i].getAttribute('cardValue');
    dealerTotal = dealerTotal + parseInt(cardValue);  
    dealerCards.push(cardValue);
    // console.log(displayCards[i].innerText);
  }
  // console.log(dealerTotal)
  
  // Total up player cards
  let playerTotal = 0;
  const playerCards = [];
  for (let i = 3; i < 6; i++) {
    let pCardValue = displayCards[i].getAttribute('cardValue');
    // playerTotal = playerTotal + parseInt(displayCards[i].innerText);  
    // playerCards.push(displayCards[i].innerText);
    playerTotal = playerTotal + parseInt(pCardValue);  
    playerCards.push(pCardValue);
  }

  let winningMessage = '';
  let winner;
  if (dealerTotal > playerTotal) {
    winningMessage = `Dealer Wins! : ${dealerTotal} vs ${playerTotal}`;
    winner = 'Dealer'
  } else if (playerTotal > dealerTotal) {
    winningMessage = `Player Wins! : ${playerTotal} vs ${dealerTotal}`;
    winner = 'Player'
  } else {
    winningMessage = `Its a Draw! : ${playerTotal} vs ${dealerTotal}`;
    winner = 'Draw'
  }

  const winnerPanel = document.getElementById('winnerPanel');
  winnerPanel.innerText = winningMessage;
  winnerPanel.style.display = 'inline-block'

  let currentGame = {
    'dealercards': dealerCards,
    'playercards' : playerCards,
    'winner': winner 
  }
  gamesArr.push(currentGame)
  localStorage.setItem('games',JSON.stringify(gamesArr));

  addEntryToGameHistoryDisplay(currentGame);

}


function drawCardClick(e) {
  currentCard++;
  
  let cards = drawCard();
  const dealerCard = cards[0];
  const playerCard = cards[1];

  // this should return the 6 displayed cards in an array. first 3 would be the dealer cards. next 3 would be the player cards
  const displayCards = document.querySelectorAll('.card-content'); 
  const cardDimensions = getCardHeightAndWidth();
  
  // -1 because array index starts with 0 and currentCard starts with 1;
  // displayCards[currentCard-1].innerText = dealerCard.value;
  displayCards[currentCard-1].innerHTML = `<img src="cards/${dealerCard.name}.png" width="${cardDimensions[1]}px" height="${cardDimensions[0]}px"/>`;
  displayCards[currentCard-1].setAttribute('cardValue', dealerCard.value);

  // +3 because the player card is on indexes 3,4 and 5;
  // displayCards[currentCard-1+3].innerText = playerCard.value;
  displayCards[currentCard-1+3].innerHTML = `<img src=cards/${playerCard.name}.png width="${cardDimensions[1]}px" height="${cardDimensions[0]}px" />`;
  displayCards[currentCard-1+3].setAttribute('cardValue',playerCard.value);

  // if this is the 3rd card drawn, get the winner, and change option to clear deck and start new game
  if (currentCard === 3) {
    getWinner();
    // Change button functionality to clear the deck.
    document.getElementById('drawCardBtn').innerText = 'Restart Game'
    document.getElementById('drawCardBtn').removeEventListener('click',drawCardClick);
    document.getElementById('drawCardBtn').addEventListener('click',startGame);
  }
  
}

// function to get the width of the cards
// returns an array with Height and Width respectively. 
function getCardHeightAndWidth() {
  const card = document.querySelector('.card');
  // card dimensions is 0.66:1.00 width:height ratio
  const cardHeight = card.clientHeight;
  const cardWidth = card.clientWidth;

  const imgWidth = cardWidth - 50 // allow for 25px margin on left and right.
  const imgHeight = imgWidth/0.65 * 1;

  return [imgHeight, imgWidth];
}


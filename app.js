var currentCard = 0;
const drawCardBtn = document.getElementById('drawCardBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
document.getElementById('winnerPanel').style.display = 'none';
drawCardBtn.addEventListener('click',drawCardClick)
clearHistoryBtn.addEventListener('click',clearHistoryClick)
displayGameHistory();

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
  let cards = [ Math.floor((Math.random()*10)+1), Math.floor(((Math.random()*10)+1)) ];
  return cards;
}

function restartGame(e) {
  currentCard = 0;
  const displayCards = document.querySelectorAll('.card-content'); 

  for (let i = 0; i < 6; i++) {
    displayCards[i].innerText = '-';  
  }
  
  // Change button functionality to draw new cards.
  document.getElementById('drawCardBtn').innerText = 'Draw Card'
  document.getElementById('drawCardBtn').removeEventListener('click',restartGame);
  document.getElementById('drawCardBtn').addEventListener('click',drawCardClick);
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
    dealerTotal = dealerTotal + parseInt(displayCards[i].innerText);  
    dealerCards.push(displayCards[i].innerText);
    // console.log(displayCards[i].innerText);
  }
  // console.log(dealerTotal)
  
  // Total up player cards
  let playerTotal = 0;
  const playerCards = [];
  for (let i = 3; i < 6; i++) {
    playerTotal = playerTotal + parseInt(displayCards[i].innerText);  
    playerCards.push(displayCards[i].innerText);
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

  // -1 because array index starts with 0 and currentCard starts with 1;
  displayCards[currentCard-1].innerText = dealerCard;
  // +3 because the player card is on indexes 3,4 and 5;
  displayCards[currentCard-1+3].innerText = playerCard;

  // if this is the 3rd card drawn, get the winner, and change option to clear deck and start new game
  if (currentCard === 3) {
    getWinner();
    // Change button functionality to clear the deck.
    document.getElementById('drawCardBtn').innerText = 'Restart Game'
    document.getElementById('drawCardBtn').removeEventListener('click',drawCardClick);
    document.getElementById('drawCardBtn').addEventListener('click',restartGame);
  }
  
}

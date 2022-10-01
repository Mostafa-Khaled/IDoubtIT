import { ICard, Type } from "../components/Card"

const allRanks: string[] = ["A","2","3","4","5","6","7","8","9","10","K","Q","J"];
const ranks : ICard[] = [];
const kinds : string[] = ["S","H","D","C"]

// Users 

// const createUser = (name: string) : string => {
// 	return ""
// } 



// Table 

const timer = (ms: number) : Promise<any> => new Promise(res => setTimeout(res, ms))

const shuffleArray = (array: ICard[]) : void => {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

allRanks.forEach(rank => {
const card : ICard = {
	kind: "S",
	rank: rank,
	backed: false,
	type: Type.Player,
	id: rank+"-S",
	selected: false
	}
	ranks.push(card);
})

const createCard = (rank: string, kind: string) : ICard => {
  const card : ICard = {
	  kind: kind,
	  rank: rank,
	  backed: false,
	  type: Type.Player,
	  id: "",
	  selected: false,
	  show: false
	}
	card.id = card.rank+"-"+card.kind;
	return card;
} 

const initializeDecks = (setCards: (cards: ICard[][]) => void) : void => {
	const cards : ICard[] = [];
	const allCards : ICard[][] = [];
	for(let i = 0; i < 52; i++){
	  cards.push(createCard(allRanks[i%13],kinds[~~(i/13)]))
	}
	shuffleArray(cards)
	for(let i = 0; i < 4; i++){
	  const row : ICard[] = [];
	  for(let j = 0; j < 13 ; j++){
	    row.push(cards[i*13+j]);
	  }
	  allCards.push(row);
	}
	setCards(allCards);
}

export{ allRanks, ranks, timer, shuffleArray, createCard, initializeDecks }
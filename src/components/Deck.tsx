/*import React from "react";
import Card from "./Card";
import { useState, useEffect } from "react";

interface IProps {
  size?: number;
}

interface Position {
  x: number;
  y: number;
}

interface ICard {
  kind: string;
  rank: string;
  id: string;
  position: Position;
  currPosition: Position;
  backed: boolean;
  style_: object;
  idx: number;
  animation: string;
  animating: number;
}

const Deck = (props: IProps) => {
  const [topDeck, setTopDeck] = useState<number[]>([]);
  const [botDeck, setBotDeck] = useState<number[]>([]);
  const [active, setActive] = useState<number>(-1);
  const [deck, setDeck] = useState<ICard[]>([]);
  const [deckAnimation, setDeckAnimation] = useState<number[]>([]);
  const handleClick = (event: React.MouseEvent, idx: number): void => {
    const deckClone: ICard[] = [...deck];
    const shiftVal = -40;
    if (active >= 0 && active < deck.length) {
      deckClone[active].currPosition.y -= shiftVal;
    }
    if (active !== idx) {
      deckClone[idx].currPosition.y += shiftVal;
    }
    setActive(active === idx ? -1 : idx);
    setDeck(deckClone);
  };
  const handDoubleClick = (event: React.MouseEvent, idx: number): void => {
    const deckClone: ICard[] = [...deck];
    if (idx >= 0 && idx < deck.length) {
      deckClone[idx].backed = !deckClone[idx].backed;
    }
    setDeck(deckClone);
  };
  const shuffleDeck = async () => {
    const len = deck.length;
    const arr: number[] = [];
    const cardArr: ICard[] = [...deck];
    const topDeck_ = [];
    const botDeck_ = [];
    const ref = 100;
    for (let i = 0; i < len; i++) arr.push(i);
    for (let i = 0; i < len * 5; i++) {
      let idx1 = ~~(Math.random() * len);
      let idx2 = ~~(Math.random() * len);
      if (idx1 !== idx2) {
        let j = arr[idx1];
        arr[idx1] = arr[idx2];
        arr[idx2] = j;
      }
    }
    for (let i = 0; i < len / 2; i++) topDeck_.push(arr[i]);
    for (let i = topDeck_.length; i < len; i++) botDeck_.push(arr[i]);
    topDeck_.sort((a,b)=>deck[a].idx-deck[b].idx);
    botDeck_.sort((a,b)=>deck[a].idx-deck[b].idx);
    topDeck_.forEach((el: number, idx: number) => {
      cardArr[el].animation = `rotateX(70deg) rotateY(0deg) rotateZ(-20deg) translateZ(${
        -200 + deck[el].idx * 3
      }px) translateX(600px)`;
      cardArr[el].animating = 0;
    });
    botDeck_.forEach((el: number, idx_: number) => {
      cardArr[el].animating = 0;
    })
    setDeck(cardArr);
    setTopDeck(topDeck_);
    setBotDeck(botDeck_);
  };

  // Intialize Deck
  useEffect(() => {
    const arr = [];
    const len = props.size || 52;
    const kinds: string[] = ["H", "C", "D", "S"];
    const ranks: string[] = ["A","2","3","4","5","6","7","8","9","10","K","J","Q",];
    for (let i = 0; i < len; i++) {
      const card: ICard = {
        kind: kinds[~~(Math.random() * kinds.length)],
        rank: ranks[~~(Math.random() * ranks.length)],
        position: {
          x: 80 + i * 15,
          y: 70,
        },
        currPosition: {
          x: 80 + i * 15,
          y: 70,
        },
        id: "",
        backed: true,
        style_: {
          top: 80,
          left: 70,
        },
        idx: i,
        animation: "",
        animating: -1,
      };
      card.id = !card.backed ? `${card.kind}_${card.rank}_${i}` : `back_${i}`;
      arr.push(card);
    }
    setDeck(arr);
  }, []);

  // Shuffling 

  useEffect(() => {
    if (
      deck.length === 0 ||
      deck.every((e) => e.animating < 0 || e.animating > 2)
    ) return;
    const ref = -200+props.size*4;
    const called =
      setTimeout(() => {
        const cardArr: ICard[] = [...deck];
        if (deck.every((e) => e.animating === 0)) {
          topDeck.forEach((el: number, idx: number) => {
            cardArr[el].animation = `rotateX(70deg) rotateY(0deg) rotateZ(-20deg) translateZ(${ ref + 3 * idx }px) translateX(600px)`;
            cardArr[el].animating = 1;
            cardArr[el].idx = idx+botDeck.length;
          });
          const len = topDeck.length;
          botDeck.forEach((el: number, idx_: number) => {
            const idx = idx_ + len; 
            cardArr[el].animation = `rotateX(70deg) rotateY(0deg) rotateZ(-20deg) translateZ(${ -200 + 3 * idx_ }px)`;
            cardArr[el].animating = 1;
            cardArr[el].idx = idx_;
          });
        } else if (deck.every(e=> e.animating === 1)) {
          topDeck.forEach((el: number, idx: number) => {
            cardArr[el].animation = `rotateX(70deg) rotateY(0deg) rotateZ(-20deg) translateZ(${ ref + 3 * idx }px)`;
            cardArr[el].animating = 2;
          });
        } else {
          const len = botDeck.length;
          topDeck.forEach((el: number, idx: number) => {
            cardArr[el].animation = `rotateX(70deg) rotateY(0deg) rotateZ(-20deg) translateZ(${ -200 + 3 * (idx+len) }px)`;
            cardArr[el].animating = -1;
          });
          botDeck.forEach((el: number, idx:number ) => {
            cardArr[el].animating = -1;
          })
          setBotDeck([]);
          setTopDeck([]);
        }
        setDeck(cardArr);
      }, 600);
      return () => {
        clearTimeout(called);
      };
  }, [deck]);
  return (
    <div>
      <div className="deck">
        {deck.map((card: ICard, idx: number) => (
          <Card
            id={card.id}
            backed={card.backed}
            active={active}
            position={deck[0].position}
            currPosition={card.currPosition}
            kind={card.kind}
            rank={card.rank}
            clickHandle={handleClick}
            dbHandle={handDoubleClick}
            key={card.id}
            idx={card.idx}
            style_={card.style_}
            animation={card.animation}
            classNames={`absolute transition-all duration-500 ease-in-out`}
          />
        ))}
        <button onClick={shuffleDeck}>shuffle</button>
      </div>
    </div>
  );
};

export default Deck;*/
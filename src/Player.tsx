import React from 'react'
import Card, { ICard } from './Card'
import { useEffect, useState } from 'react'

interface IProps {
	id: string
	cards: ICard[],
	selectCards: any
}


const Player = (props: IProps) => {
	// States 
	const [cards, setCards] = useState<ICard[]>([]); 
	const [selectedCards, setSelectedCards] = useState<ICard[]>([]);

	// Start Hook 
	useEffect(() => {
		const cards_ = props.cards.map((card: ICard) => {
			const card_ = {...card};
			card_.id += "_"+props.id;
			card_.playerID = props.id;
			return card_; 
		})
		setCards(cards_);
		setSelectedCards([]);
	}, [props.cards]);

	// Methods
	/*const playCard = (event: React.MouseEvent, card: ICard) : void => {
		setCards(cards.filter(el =>{
			console.log(el.id === card.id);
			return el.id !== card.id
		}));
		props.playCard(event, card);
	}*/

	const selectCard = (event: React.MouseEvent, card: ICard) : void => {
		if(props.id !== localStorage.getItem("p_id")) return;
		let found = false;
		for(let card_ of selectedCards){
			if(card_.id === card.id){
				found = true;
				break;
			}
		}
		if(!found){
			const cards_ = [...selectedCards, card];
			const cards__ = cards_.map(el => {
				const el_ = {...el};
				el_.selected = false;
				return el_
			})
			props.selectCards(cards__)
			setSelectedCards(cards_)
			card.selected = true;
		}else{
			const cards_ = selectedCards.filter(card_ => card_.id !== card.id);
			setSelectedCards(cards_);
			props.selectCards(cards_);
			card.selected = false;	
		} 
	}

	// Render 

	return (
		<div className = "player basis-full">
			<div className = "player-profile">
				
			</div>
			<div className = "cards relative h-20 flex flex-row">
				{
					cards.map((card: ICard, idx: number)=>{
						return <div key={card.id} className="" style={{"flexBasis" : 100/cards.length+"%"}} onClick={(e)=>selectCard(e, card)}>
							 <Card id={card.id} rank={card.rank} position={card.position} backed={localStorage.getItem("p_id") !== props.id} type={card.type} kind={card.kind} selected={card.selected}/> 
						</div>
					})
				}
			</div>
		</div>
	)
}


export default Player
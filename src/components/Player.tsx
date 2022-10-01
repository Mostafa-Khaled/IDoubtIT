import React, { CSSProperties } from 'react'
import Card, { ICard } from './Card'
import { useEffect, useState } from 'react'

interface IProps {
	id: string
	cards: ICard[],
	idx: number,
	selectCards: any
}


const Player = (props: IProps) => {
	// Dimensions

	const dim = {w: 667 - 50 , h: 375 - 50}

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
	}, [props.cards, props.id]);

	// Methods

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

	const width : CSSProperties = { width: `${( props.idx % 2 === 0 ? dim.w : dim.h)}px` }
	const dist = ((props.idx%2 === 0 ? dim.w : dim.h)-48)/(cards.length+1);
	// Render 

	return (
		<div className = "player basis-full" style={width}>
			<div className = "player-profile">
				
			</div>
			<div className = "cards h-20 relative" style={width}>
				{
					cards.map((card: ICard, idx: number)=>{
						const style_ : CSSProperties = { transform : `translateX(${(idx+1)*dist}px)`, position: "absolute"};
						return <div key={card.id} className="" 
						// style={{"flexBasis" : 100/cards.length+"%"}}
						style={style_} 
						onClick={(e)=>selectCard(e, card)}>
							 <Card id={card.id} rank={card.rank} backed={localStorage.getItem("p_id") !== props.id} type={card.type} kind={card.kind} selected={card.selected}/> 
						</div>
					})
				}
			</div>
		</div>
	)
}


export default Player
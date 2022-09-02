//import Module from 'module'
import React, { Component } from 'react'
import "./Hangman.css"
import ENGLISH_WORDS from "./assets/words.js"
import img0 from './assets/0.jpg'
import img1 from './assets/1.jpg'
import img2 from './assets/2.jpg'
import img3 from './assets/3.jpg'
import img4 from './assets/4.jpg'
import img5 from './assets/5.jpg'
import img6 from './assets/6.jpg'

interface Props{
  maxWrong : number,
  imgs : any
}
interface State{
  nWrong : number,
  guessed : Set<string>,
  answer : string,
  gameOver : boolean,
  win : boolean
}

export default class Hangman extends Component<Props, State> {
  static defaultProps = {
    maxWrong : 6,
    imgs: [img0, img1, img2, img3, img4, img5, img6],
  }
  constructor(props : Props){
    super(props);
    this.state = {
      nWrong : 0,
      guessed : new Set<string>(),
      answer : this.pickRandom(ENGLISH_WORDS),
      gameOver : false,
      win: false
    }
    this.handleGuess = this.handleGuess.bind(this)
    this.reset = this.reset.bind(this)
  }
  pickRandom(wordList : string[]) : string{
    let random = Math.floor( Math.random() * wordList.length);
    return wordList[random];
  }
  guessedWord() : string[] {
    return this.state.answer.split("").
    map((ltr : string) : string => this.state.guessed.has(ltr) ? ltr : "_");
  }
  handleGuess(evt : React.MouseEvent) : void {
    if(this.state.gameOver || this.state.win) return;
    let ltr : any = evt.target;
    ltr = ltr.value;
    this.setState(st => ({
      guessed : st.guessed.add(ltr),
      gameOver : ( st.nWrong + ( st.answer.includes(ltr) ? 0 : 1 ) ) >= this.props.maxWrong ? true : false,
      nWrong : st.nWrong + ( st.answer.includes(ltr) ? 0 : 1 ),
    }));
    let makeWin : boolean = true;
    let letters : string[] = Array.from(this.state.guessed); 
    letters = [...letters, ltr];
    this.state.answer.split("").forEach((char : string) : void => {
      if(makeWin && !letters.includes(char)) makeWin = false;
    })
    if(makeWin){
      this.setState(st => ({
        win:true
      }))
    }
  }
  generateButtons() : JSX.Element[] {
    return "abcdefghijklmnopqrstuvwxyz".split("").map( 
      (ltr : string) : JSX.Element =>
      <button value={ltr} key={ltr} onClick={this.handleGuess} 
      disabled={this.state.guessed.has(ltr)}> 
        {ltr} 
      </button>
     )
  }
  reset() : void{
    this.setState(st => ({
      nWrong : 0,
      gameOver : false,
      guessed : new Set<string>(),
      win: false,
      answer: this.pickRandom(ENGLISH_WORDS)
    }))
  }
  render() {
    return (
      <div className="Hangman">
        <h1> Hangman </h1>
        <img src={this.props.imgs[this.state.nWrong]}/>
        <p className="number-wrong bg-sky-500 my-2 py-2 px-3 border-1 rounded-lg">
          { this.state.gameOver ? "Game over" : 
          this.state.win ? "Congrats" : `Number of gussed wrong : ${this.state.nWrong}` }
        </p>
        <p className="Hangman-word">{this.guessedWord()}</p>
        <p className="Hangman-btns">{this.generateButtons()}</p>
        <div className="my-4 rounded-lg bg-indigo-800 text-white py-3 hover:bg-gray-800 width-20"
        onClick={this.reset}>Reset</div>
      </div>
    )
  }
}

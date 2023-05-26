import { doc, getDoc, setDoc } from 'firebase/firestore'
import db from '../firebase/methods'

interface IObj{
  n: number
}

const m = 2 ** 32;
const a = 134775813;
const c = 1;

const randomUp = (char: string) : string => Math.random() > 0.5 ? char.toUpperCase() : char;

const lcg = (currGame: IObj) : void => {
    currGame.n = ( a * currGame.n  + c ) % m;
}

const randomFill = (length : number) : string => {
  const a = 36 ** (length - 1);
  const b = 36 ** length;
  const n = Math.floor( Math.random() * b ) + a;
  return n.toString(36);
}

const uid = async (length?: number) => {
    const docRef = doc(db, "doubt", "uid");
    const docObj = await getDoc(docRef);
    const currGame : IObj = (docObj.data()) as IObj; 
    const len = length || 6;
    lcg(currGame);
    let str = currGame.n.toString(36);
    str = str.split("").map(randomUp).join("")
    str = str.padStart(len, randomFill(len)).slice(0,len);
    await setDoc(docRef, {n : currGame.n});
    return str;
}

export default uid
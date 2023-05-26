import db from './firebase'
import { collection, addDoc, getDocs } from "firebase/firestore"

const checkAvailableRoom = async (roomID: string) => {
  let available = false;
  const colRef = collection(db, "doubt");
  const docsArr = await getDocs(colRef);
  docsArr.docs.forEach((doc) => {
    const docID = doc.id.slice(0,8);
    if(roomID === docID) available = true;
  })
  return available;
}

const checkDuplicatePlayerIDs = () : boolean => {
	return true
}

export default db
export { checkDuplicatePlayerIDs, checkAvailableRoom }
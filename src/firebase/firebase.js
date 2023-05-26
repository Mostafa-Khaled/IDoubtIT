import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({
  apiKey: "AIzaSyClats4czcl_uxeFV2lozJvti-mGXv9rXI",
  authDomain: "card-game-e6a83.firebaseapp.com",
  projectId: "card-game-e6a83",
  storageBucket: "card-game-e6a83.appspot.com",
  messagingSenderId: "513371320659",
  appId: "1:513371320659:web:cf73f7734c77fd11a731a6"
});

const db = getFirestore(app);


export default db;
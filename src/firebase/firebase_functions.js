/* Importing the initializeApp function from the firebase/app module. */
import { initializeApp } from "firebase/app";

import { firebaseConfig } from "./config";

/* Importing the functions from the firestore.js file. */
import {
    getFirestore,
    collection,
    // getDocs,
    addDoc,
    // deleteDoc,
    // doc,
    // onSnapshot,
    // query,
    // where,
    serverTimestamp,
    // orderBy,

} from "firebase/firestore";

/* Initializing the firebase app. */
initializeApp(firebaseConfig);

/* A shorthand for console.log. */
const log = console.log;

// initialize the firestore instance
const db = getFirestore();

// get a reference to a specific collection
const housesCollection = collection(db, "houses");

const addADS = async (
    lat,
    lng,
    sub_city,
    price,
    surface,
    type,
    duration,
    availability,
    startDate,
    endDate,
) => {
    await addDoc(housesCollection, {
        latitude: lat,
        longitude: lng,
        sub_city: sub_city,
        price: price,
        surface: surface,
        type: type,
        duration: duration,
        availability: availability,
        startDate: startDate,
        endDate: endDate,
        createdAt: serverTimestamp(),
    }).then(() => {
        // log("Document successfully written!");
        return true;
    }
    ).catch(err => {
        log(err);
        return err;
    }
    );
};

export { addADS, housesCollection };
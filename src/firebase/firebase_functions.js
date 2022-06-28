/* Importing the initializeApp function from the firebase/app module. */
import { initializeApp } from "firebase/app";

import { firebaseConfig } from "./config";

/* Importing the functions from the firestore.js file. */
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    // deleteDoc,
    // doc,
    // onSnapshot,
    query,
    where,
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
    date,
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
        date: date,
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

async function getData({ setLocations }) {
    const responses = await getDocs(housesCollection).then(data => {
        let houses = [];
        data.docs.forEach(doc => {
            houses.push({ ...doc.data(), id: doc.id });
        }
        );
        return houses;
    }
    ).catch(err => {
        log(err);
    }
    );
    setLocations(responses);
    return responses;
}

const searchBySubCity = async ({value, setLoading, setLocations, info}) => {

    // const responses = await fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/' + value + '.json?access_token=pk.eyJ1IjoieGNhZ2U3IiwiYSI6ImNsNGlrbTc0bTBmajgzY3BmNHA1NDVwMmYifQ.SrIHjoAhw8wWViQsLfjmUQ')
    //   .then(response => {
    //     return response.json();
    //   })

    setLoading(true);

    // get data from collection
    const q = query(housesCollection, where('sub_city', '==', value.toLowerCase()));
    const responses = await getDocs(q).then(data => {
        let houses = [];
        data.docs.forEach(doc => {
            houses.push({ ...doc.data(), id: doc.id });
        }
        );
        return houses;
    }
    ).catch(err => {
        log(err);
    }
    );

    if (responses.length === 0) {
        setLoading(false);
        info();
        setLocations([]);
    }
    else {
        setLocations(responses);
        setLoading(false);
    }
};

export { addADS, housesCollection, getData, searchBySubCity };
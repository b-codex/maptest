/* Importing the initializeApp function from the firebase/app module. */
import { initializeApp } from "firebase/app";

import { firebaseConfig } from "./config";

/* Initializing the firebase app. */
initializeApp(firebaseConfig);

/* Importing the functions from the firestore.js file. */
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
    serverTimestamp,
    orderBy,

} from "firebase/firestore";

/* A shorthand for console.log. */
const log = console.log;

// initialize the firestore instance
const db = getFirestore();

// get a reference to a specific collection
const houses = collection(db, "houses");

// get data from collection
// getDocs(houses).then(data => {
//     let houses = [];
//     data.docs.forEach(doc => {
//         houses.push({ ...doc.data(), id: doc.id });
//     }
//     );

//     log(houses);
// }
// ).catch(err => {
//     log(err);
// }
// );

/* Listening for a submit event on the form. When the form is submitted, it gets the values of the
latitude and longitude inputs and adds them to the houses collection. */
const form = document.querySelector('.add');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const latitude = document.querySelector('#latitude').value;
    const longitude = document.querySelector('#longitude').value;

    addDoc(houses, {
        latitude: latitude,
        longitude: longitude,
        createdAt: serverTimestamp(),
    }).then(() => {
        log('Document added');
    }
    ).catch(err => {
        log(err);
    }
    );
});

/* Listening for a submit event on the form. When the form is submitted, it gets the value of the id
input and deletes the document with that id from the houses collection. */
const delForm = document.querySelector('.delete');
delForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.querySelector('#doc').value;

    const d = doc(db, 'houses', id);
    deleteDoc(d).then(() => {
        log('Document deleted');
    }
    ).catch(err => {
        log(err);
    }
    );
});

// real time listener for data
// onSnapshot(houses, (snapshot) => {
//     let houses = [];
//     snapshot.docs.forEach(doc => {
//         houses.push({ ...doc.data(), id: doc.id });
//     }
//     );

//     log(houses);
// })

// query for data
const q = query(houses, where('availability', '==', 'unoccupied'));
getDocs(q).then(data => {
    let houses = [];
    data.docs.forEach(doc => {
        houses.push({ ...doc.data(), id: doc.id });
    }
    );
    log(houses);
}
).catch(err => {
    log(err);
}
);
// then(data => {
//     let houses = [];
//     data.docs.forEach(doc => {
//         houses.push({ ...doc.data(), id: doc.id });
//     }
//     );

//     log(houses);
// }
// ).catch(err => {
//     log(err);
// }
// );
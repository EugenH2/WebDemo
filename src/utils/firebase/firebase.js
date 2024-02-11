import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
  DocumentSnapshot,
  onSnapshot, orderBy, limit, where, startAfter,
  increment,
  updateDoc, arrayUnion, arrayRemove, deleteField,
  runTransaction
} from 'firebase/firestore' // 'firebase/app/lite'


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "xxxxxxx",
  authDomain: "xxxxxxxxxx",
  projectId: "xxxxxxxxx",
  storageBucket: "xxxxxxxx",
  messagingSenderId: "xxxxxxxxxxxxx",
  appId: "xxxxxxxxxxxxxx",
  measurementId: "xxxxxxxxxxxxx"
};

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (email.trim() === "" || password.trim() === "") { return };

  return await createUserWithEmailAndPassword(auth, email, password)
}

/*const googleProvider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account"
});
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
*/

export const createUserDocumentFromAuth = async (userAuth, additionalInfo = { username: "Anonymous", usernameLq: "anonymous" }) => {
  if (!userAuth) return;
  const userDocRef = doc(db, "users", userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        email: userAuth.email,
        ...additionalInfo,
        createdAt
      });
    } catch (error) {
      alert("Something went wrong. Database Error: 800");
    }

  }

  return userDocRef;
}

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (email.trim() === "" || password.trim() === "") { return };

  return await signInWithEmailAndPassword(auth, email, password)
}

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);


/*export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title);
    batch.set(docRef, object);
  });

  await batch.commit();
};*/

export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
  const docRef = doc(collection(db, collectionKey));

  await setDoc(docRef, objectsToAdd)
};

export const addArrayToDb = async (collectionKey, id, arrayKey, value) => {
  const docRef = doc(db, collectionKey, id);

  await updateDoc(docRef, {
    [arrayKey]: arrayUnion(value)
  });
};

export const deleteArrayFromDb = async (collectionKey, id, arrayKey, value) => {
  const docRef = doc(db, collectionKey, id);

  await updateDoc(docRef, {
    [arrayKey]: arrayRemove(value)
  });
};

export const incrementDbValue = async (collectionKey, id, value) => {
  const docRef = doc(db, collectionKey, id);

  await updateDoc(docRef, { [value]: increment(1) });
};

export const updateDbValue = async (collectionKey, id, object) => {
  const docRef = doc(db, collectionKey, id);

  await updateDoc(docRef, object);
};

/*export const getCategoriesAndDocuments = async (collectionName) => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef)

  const querySnapshot = await getDocs(q);
  const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
    const { title, items } = docSnapshot.data();
    acc[title.toLowerCase()] = items;
    return acc;
  }, {});

  return categoryMap;
};*/

/*export const getArticles = async (collectionName) => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  const collectionMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
    const key = docSnapshot.id;
    const items = docSnapshot.data();

    acc[key] = items;
    return acc;
  }, {});

  return collectionMap;
};*/

/*export const getArticles = async (collectionName, setArticlesLimit) => {
  const q = query(collection(db, collectionName), orderBy("timestamp", "desc"), limit(2));
  const querySnapshot = await getDocs(q);

  setArticlesLimit({ querySnapshot: querySnapshot, loadNextArticles: false });
  return querySnapshot;
};


export const getNextArticles = async (collectionName, limitArg, setArticlesLimit) => {
  const lastVisible = limitArg.querySnapshot.docs[limitArg.querySnapshot.docs.length - 1]

  const q = query(collection(db, collectionName), orderBy("timestamp", "desc"), startAfter(lastVisible), limit(1));
  const querySnapshot = await getDocs(q);

  setArticlesLimit({ querySnapshot: querySnapshot, loadNextArticles: false });
  return querySnapshot;
};*/


export const getUpdatedArticles = (collectionName, articlesLimit, articleQueryCursor, callback) => {
  if (articlesLimit.counter) {
    if (articlesLimit.next) {
      const q = query(collection(db, collectionName), orderBy("timestamp", "desc"), limit(articleQueryCursor.limit), startAfter(articleQueryCursor.end));
      return onSnapshot(q, callback);
    }
    else {
      const q = query(collection(db, collectionName), orderBy("timestamp", "desc"), limit(articleQueryCursor.limit));
      return onSnapshot(q, callback);
    }
  }
  else {
    const q = query(collection(db, collectionName), orderBy("timestamp", "desc"), limit(4));
    return onSnapshot(q, callback);
  }
};


export const getDbData = async (collectionName, id) => {
  const docSnapshot = await getDoc(doc(db, collectionName, id));
  return docSnapshot.data();
};


export const nmbrOfSameNameInDb = async (collectionName, usernameLq) => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, where("usernameLq", "==", usernameLq));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((user) => user.data());
};

export const changeNameInDbAtomic = async (username, collectionKey, id) => {
  const docRef = doc(db, collectionKey, id);

  try {
    await runTransaction(db, async (transaction) => {
      const sfDoc = await transaction.get(docRef);
      if (!sfDoc.exists()) {
        throw "Document does not exist!";
      }

      const nmbrOfSameName = await nmbrOfSameNameInDb("users", username.toLowerCase());
      if (nmbrOfSameName.length > 0 && username.toLowerCase() != "anonymous") {
        const max = nmbrOfSameName.reduce((prev, current) => {
          return ((prev.sameNameCounter ?? 0) > (current.sameNameCounter ?? 0)) ? (prev ?? 0) : (current ?? 0);
        }, 0)

        const sameNameCounter = sfDoc.data().sameNameCounter = (max.sameNameCounter ?? 0) + 1;
        transaction.update(docRef, { username: username, usernameLq: username.toLowerCase(), sameNameCounter: sameNameCounter });
      }
      else {
        transaction.update(docRef, { username: username, usernameLq: username.toLowerCase(), sameNameCounter: deleteField() });
      }
    });

    //return username;
  }
  catch (error) {
    alert("Something went wrong. Name registration Error: 805");
    return Promise.reject(error);
  }
};

/*useEffect(() => { 
  const getCategoriesMap = async () => {
    const categoryMap = await getCategoriesAndDocuments();
  }
  
  getCategoriesMap();
}, []);*/

/*const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { auth };
export default db;*/
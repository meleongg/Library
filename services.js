import { db } from './firebase.js';
import { collection, doc, getDocs, addDoc, getDoc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.9.2/firebase-firestore.js'

const serviceFunctions = (() => {

    const addBook = async (title, author, pages, read, color) => {
        try {
            await addDoc(collection(db, 'books'), {
                title: title,
                author: author, 
                pages: pages, 
                read: read,
                color: color
            });
        } catch (e) {
            console.log("Error adding document: ", e);
        }
    }

    // return an array of objects
    const getBooks = async () => {
        let books = [];
        try {
            const querySnapshot = await getDocs(collection(db, 'books'));
            // returns a list of docs that fit the query reqs
            querySnapshot.forEach((doc) => {
                let bookObj = {}
                bookObj[doc.id] = doc.data();
                books.push(bookObj);
            });
        } catch (e) {
            console.log("Error with fetching books", e);
        }

        return books;
    }

    const getBookById = async (id) => {
        const docRef = doc(db, 'books', id);
        try {
            const docSnap = await getDoc(docRef);
            return docSnap.data();
        } catch (e) {
            console.log('No such document!', e);
        }
    }

    const updateBookReadStatus = async (id) => {
        let bookObj = await getBookById(id);
        const docRef = doc(db, 'books', id);
        let newReadStatus;

        if (bookObj['read'] === 'read') {
            newReadStatus = 'unread';
        } else {
            newReadStatus = 'read'
        }

        updateDoc(docRef, {
            read: newReadStatus
        });
    }

    const deleteBook = async (id) => {
        const docRef = doc(db, 'books', id);
        try {
            await deleteDoc(docRef);
        } catch (e) {
            console.log('Unable to delete doc!', e);
        }
    }

    return {
        addBook, getBooks, updateBookReadStatus, deleteBook
    }
})(); 

export { serviceFunctions }; 
import { serviceFunctions } from "./services.js";

const addBookBtn = document.getElementsByClassName("add-book-btn")[0];

const formContainer = document.getElementsByClassName("form-container")[0];
const form = document.getElementsByClassName("form")[0];
const cancelBtn = document.getElementsByClassName("cancel-btn")[0];

const titleInput = document.getElementById("title-input");
const authorInput = document.getElementById("author-input");
const pagesInput = document.getElementById("pages-input");
const readInput = document.getElementById("read-input");

const error = document.getElementsByClassName("error")[0];
error.style.display = "none";

const errorText = document.getElementsByClassName("error-text")[0];

let myLibrary = [];

const getBooks = async () => {
    myLibrary = await serviceFunctions.getBooks();
}

const initBooks = async () => {
    await getBooks();
    render();
}

initBooks();

addBookBtn.addEventListener("click", () => {
    formContainer.style.display = "flex";
});

cancelBtn.addEventListener("click", (e) => {
    formContainer.style.display = "none";
    e.preventDefault();
    form.reset();
});

function getReadChoice() {
    const readChoice = document.getElementsByClassName("readChoice");
    for (let i=0; i<readChoice.length; i++) {
        if (readChoice[i].checked) {
            return readChoice[i].value;
        }
    }

    return "read";
}

function getUserValues() {
    let values = []
    for (let i=0; i<(form.elements.length - 4); i++) {
        values[i] = form.elements[i].value;
    }
    values.push(getReadChoice());
    form.reset();
    return values;
}

function showError() {
    error.style.display = "flex";
    if (titleInput.validity.valueMissing) {
        errorText.textContent = "You must enter a title!";
    }
    if (authorInput.validity.valueMissing) {
        errorText.textContent = "You must enter an author!";
    }
    if (pagesInput.validity.valueMissing) {
        errorText.textContent = "You must enter a page number!";
    }
    if (readInput.validity.valueMissing) {
        errorText.textContent = "You must select Read or Unread!";
    }
}

function checkAllValidInputs() {
    if (!titleInput.validity.valid) {
        return false; 
    }
    
    if (!authorInput.validity.valid) {
        return false; 
    }

    if (!pagesInput.validity.valid) {
        return false; 
    }

    if (!readInput.validity.valid) {
        return false; 
    }
   
    return true;
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!checkAllValidInputs()) {
        showError();
    } else {
        error.style.display = "none";
        formContainer.style.display = "none";
        addBookToLibrary(getUserValues());
    }
});

titleInput.addEventListener("input", (e) => {
    if (titleInput.validity.valid) {
        error.style.display = "none";
        errorText.textContent = "";
        errorText.className = "error-text";
    } else {
        showError();
    }
});

authorInput.addEventListener("input", (e) => {
    if (authorInput.validity.valid) {
        error.style.display = "none";
        errorText.textContent = "";
        errorText.className = "error-text";
    } else {
        showError();
    }
});

pagesInput.addEventListener("input", (e) => {
    if (pagesInput.validity.valid) {
        error.style.display = "none";
        errorText.textContent = "";
        errorText.className = "error-text";
    } else {
        showError();
    }
});

readInput.addEventListener("input", (e) => {
    if (readInput.validity.valid) {
        error.style.display = "none";
        errorText.textContent = "";
        errorText.className = "error-text";
    } else {
        showError();
    }
});

// Old Book Class

// class Book {
//     constructor(title, author, pages, read, color) {
//         this.title = title;
//         this.author = author;
//         this.pages = pages;
//         this.read = read;
//         this.color = color;
//     }

//     toggleRead() {
//         if (this.read === "read") {
//             this.read = "unread";
//         } else {
//             this.read = "read";
//         }
//     }
// }

async function addBookToLibrary (values) {
    let color = generateRandomColor()
    const MAX_BOOKS = 12;
    const alertElm = document.getElementsByClassName("alert")[0];
    const alertMsg = document.getElementsByClassName("alert-msg")[0];
    const main = document.getElementsByTagName("main")[0];

    console.log(myLibrary);

    if (myLibrary.length < MAX_BOOKS) {
        await serviceFunctions.addBook(values[0], values[1], values[2], values[3], color);
        render();
        alertElm.style.display = "block";
        alertMsg.innerHTML = "Book has been added!";
        main.style.gridTemplateRows = "2fr 1fr 1fr 20fr";
        
        setTimeout (() => {
            alertElm.style.display = "none";
            main.style.gridTemplateRows = "2fr 1fr 20fr";
        }, 1500);
    } else {
        alert("Bookshelf is full!");
    }
}

function renderTitle(book) {
    let cardTitle = document.createElement("div");
    let cardTitleText = document.createElement("p");
    cardTitleText.innerHTML = book.title; 
    cardTitleText.classList.add("card-text");
    cardTitle.appendChild(cardTitleText);

    return cardTitle;
}

function renderAuthor(book) {
    let cardAuthor = document.createElement("div");
    let cardAuthorText = document.createElement("p");
    cardAuthorText.innerHTML = book.author; 
    cardAuthorText.classList.add("card-text");
    cardAuthor.appendChild(cardAuthorText);
    
    return cardAuthor;
}

function renderPages(book) {
    let cardPages = document.createElement("div");
    let cardPagesText = document.createElement("p");

    if (book.pages === "") {
        cardPagesText.innerHTML = "";
    } else {
        cardPagesText.innerHTML = "Pages: " + book.pages; 
    }   

    cardPagesText.classList.add("card-text");
    cardPages.appendChild(cardPagesText);

    return cardPages;
}

async function changeReadStatus(card) {
    let id = card.id; 
    await serviceFunctions.updateBookReadStatus(id);
    render();
}

function detectChangeStatus(btn) {
    btn.addEventListener("click", (e) => {
        let btnDiv = e.target.parentElement;
        let cardDiv = btnDiv.parentElement;
        changeReadStatus(cardDiv);
    })
}

function renderStatus(book) {
    let cardStatus = document.createElement("div");
    let cardStatusBtn = document.createElement("button");
    let readStr = book['read'][0].toUpperCase() + book['read'].substring(1);

    cardStatusBtn.classList.add("cardStatusBtn");
    cardStatusBtn.innerHTML = readStr;
    cardStatus.appendChild(cardStatusBtn);
    detectChangeStatus(cardStatusBtn);

    return cardStatus;
}

async function deleteCard(card) {
    const alert = document.getElementsByClassName("alert")[0];
    const alertMsg = document.getElementsByClassName("alert-msg")[0];
    const main = document.getElementsByTagName("main")[0];
    let id = card.id; 
    await serviceFunctions.deleteBook(id);
    card.innerHTML = "";
    card.remove();
    render();
    
    alert.style.display = "block";
    alertMsg.innerHTML = "Book has been deleted!";
    main.style.gridTemplateRows = "2fr 1fr 1fr 20fr";
    
    setTimeout (() => {
        alert.style.display = "none";
        main.style.gridTemplateRows = "2fr 1fr 20fr";
    }, 1500);
}

function detectDelete(btn) {
    btn.addEventListener("click", (e) => {
        let btnDiv = e.target.parentElement;
        let cardDiv = btnDiv.parentElement;
        deleteCard(cardDiv);
    })
}

function renderDelete() {
    let cardDelete = document.createElement("div");
    let cardDeleteBtn = document.createElement("button");
    cardDeleteBtn.classList.add("cardDeleteBtn");
    cardDeleteBtn.innerHTML = "Delete";
    cardDelete.appendChild(cardDeleteBtn);
    detectDelete(cardDeleteBtn);

    return cardDelete;
}

function findRow(rows) {
    const MAX_PER_ROW = 4;
    for (let i=0; i<rows.length; i++) {
        if (rows[i].childElementCount < MAX_PER_ROW) {
            return rows[i];
        } 
    }
}

function generateRandomColor() {
    let randomColor = `hsla(${~~(360 * Math.random())}, 70%, 70%, 0.8)`;
    return randomColor;
}

function emptyRows(rows) {
    for (let i=0; i<rows.length; i++) {
        rows[i].innerHTML = "";
    }
}

async function render() {
    const row1 = document.getElementsByClassName("row-1")[0];
    const row2 = document.getElementsByClassName("row-2")[0];
    const row3 = document.getElementsByClassName("row-3")[0];

    let rows = [row1, row2, row3];
    emptyRows(rows);
    await getBooks();

    for (let i=0; i<myLibrary.length; i++) {
        let book = {};
        let id;

        for (const [bookId, bookObj] of Object.entries(myLibrary[i])) {
            id = bookId; 
            book = bookObj; 
        }

        let card = document.createElement("div");
        card.id = id; 
        card.dataset.index = i;
        card.classList.add("card");
        card.style.backgroundColor = book.color;

        let cardTitle = renderTitle(book);
        let cardAuthor = renderAuthor(book);
        let cardPages = renderPages(book);
        let cardStatus = renderStatus(book);
        let cardDelete = renderDelete();

        card.appendChild(cardTitle);
        card.appendChild(cardAuthor);
        card.appendChild(cardPages);
        card.appendChild(cardStatus);
        card.appendChild(cardDelete);

        let row = findRow(rows);
        row.appendChild(card);
    }
}

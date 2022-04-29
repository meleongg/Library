const addBookBtn = document.getElementsByClassName("add-book-btn")[0];

const formContainer = document.getElementsByClassName("form-container")[0];
const form = document.getElementsByClassName("form")[0];
const submitBtn = document.getElementsByClassName("submit-btn")[0];
const cancelBtn = document.getElementsByClassName("cancel-btn")[0];

const titleInput = document.getElementById("title-input");
const authorInput = document.getElementById("author-input");
const pagesInput = document.getElementById("pages-input");
const readInput = document.getElementById("read-input");

const error = document.getElementsByClassName("error")[0];
error.style.display = "none";

const errorText = document.getElementsByClassName("error-text")[0];

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

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!titleInput.validity.valid) {
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

let myLibrary = [];

class Book {
    constructor(title, author, pages, read, color) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
        this.color = color;
    }

    toggleRead() {
        if (this.read === "read") {
            this.read = "unread";
        } else {
            this.read = "read";
        }
    }
}

function addBookToLibrary(values) {
    let color = generateRandomColor()
    book = new Book(values[0], values[1], values[2], values[3], color);
    const MAX_BOOKS = 12;
    const alert = document.getElementsByClassName("alert")[0];
    const alertMsg = document.getElementsByClassName("alert-msg")[0];
    const main = document.getElementsByTagName("main")[0];

    if (myLibrary.length < MAX_BOOKS) {
        myLibrary.push(book);
        render();
        alert.style.display = "block";
        alertMsg.innerHTML = "Book has been added!";
        main.style.gridTemplateRows = "2fr 1fr 1fr 20fr";
        
        setTimeout (() => {
            alert.style.display = "none";
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

function changeReadStatus(card) {
    index = card.dataset.index;
    book = myLibrary[index];
    book.toggleRead();
    render();
}

function detectChangeStatus(btn) {
    btn.addEventListener("click", (e) => {
        btnDiv = e.target.parentElement;
        cardDiv = btnDiv.parentElement;
        changeReadStatus(cardDiv);
    })
}

function renderStatus(book) {
    let cardStatus = document.createElement("div");
    cardStatusBtn = document.createElement("button");
    cardStatusBtn.classList.add("cardStatusBtn");
    cardStatusBtn.innerHTML = book.read[0].toUpperCase() + book.read.substring(1);
    cardStatus.appendChild(cardStatusBtn);
    detectChangeStatus(cardStatusBtn);

    return cardStatus;
}

function deleteCard(card) {
    const alert = document.getElementsByClassName("alert")[0];
    const alertMsg = document.getElementsByClassName("alert-msg")[0];
    const main = document.getElementsByTagName("main")[0];
    index = card.dataset.index; 
    myLibrary.splice(index, 1);
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
        btnDiv = e.target.parentElement;
        cardDiv = btnDiv.parentElement;
        deleteCard(cardDiv);
    })
}

function renderDelete() {
    let cardDelete = document.createElement("div");
    cardDeleteBtn = document.createElement("button");
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

function render() {
    const row1 = document.getElementsByClassName("row-1")[0];
    const row2 = document.getElementsByClassName("row-2")[0];
    const row3 = document.getElementsByClassName("row-3")[0];

    rows = [row1, row2, row3];
    emptyRows(rows);

    for (let i=0; i<myLibrary.length; i++) {
        let book = myLibrary[i];
        let card = document.createElement("div");
        card.dataset.index = i;
        card.classList.add("card");
        card.style.backgroundColor = book.color;

        cardTitle = renderTitle(book);
        cardAuthor = renderAuthor(book);
        cardPages = renderPages(book);
        cardStatus = renderStatus(book);
        cardDelete = renderDelete();

        card.appendChild(cardTitle);
        card.appendChild(cardAuthor);
        card.appendChild(cardPages);
        card.appendChild(cardStatus);
        card.appendChild(cardDelete);

        row = findRow(rows);
        row.appendChild(card);
    }
}

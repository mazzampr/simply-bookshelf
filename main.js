const UNCOMPLETE_BOOK_ID = "incompleteBookshelfList";
const COMPLETE_BOOK_ID = "completeBookshelfList";
const BOOK_ITEMID = "itemId";
const addBookIcon = document.getElementById("add-book");
const iconAdd = document.getElementById("icon-add");
const submitForm = document.getElementById("inputBook");

function addBook(){
    const uncompletedBookList = document.getElementById(UNCOMPLETE_BOOK_ID);

    const inputTitle = document.getElementById("inputBookTitle").value;
    const inputAuthor = document.getElementById("inputBookAuthor").value;
    const inputYear = document.getElementById("inputBookYear").value;

    const book = makeBook(inputTitle, inputAuthor, inputYear, false);
    const bookObject = composeBookObject(inputTitle, inputAuthor, inputYear, false);

    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    uncompletedBookList.append(book);
    updateDataToStorage();
}

function makeBook(title, author, year, isComplete){
    const titleBook = document.createElement("h3");
    titleBook.innerText = title;

    const authorBook = document.createElement("p");
    authorBook.classList.add("author");
    authorBook.innerText = author;

    const yearBook = document.createElement("p");
    yearBook.classList.add("year");
    yearBook.innerText = year;

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action");

    const container = document.createElement("article");
    container.classList.add("book-item");
    container.append(titleBook, authorBook, yearBook, buttonContainer);

    if(isComplete){
        buttonContainer.append(
            createReviewButton(),
            createTrashButton()
        );
    } else{
        buttonContainer.append(
            createSuccesButton(),
            createTrashButton()
        );
    }

    return container;
}

function createButton(buttonTypeClass, buttonText, eventListener){
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.innerText = buttonText;
    button.addEventListener("click", function(event){
        eventListener(event);
    });
    return button;
}

function addBookToCompleted(bookElement){

    const titleBook = bookElement.querySelector(".book-item > h3").innerText;
    const authorBook = bookElement.querySelector(".author").innerText;
    const yearBook = bookElement.querySelector(".year").innerText;

    const newBook = makeBook(titleBook, authorBook, yearBook, true);
    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isComplete = true;
    newBook[BOOK_ITEMID] = book.id;

    const completedList = document.getElementById(COMPLETE_BOOK_ID);
    completedList.append(newBook);


    bookElement.remove();
    updateDataToStorage();
}

function createSuccesButton(){
    return createButton("green", "Selesai dibaca", function(event){
        addBookToCompleted(event.target.parentElement.parentElement);
    });
}

function removeBookfromComplete(bookElement){
    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    bookElement.remove();
    updateDataToStorage();
}

function createTrashButton(){
    return createButton("red", "Hapus Buku", function(event){
        removeBookfromComplete(event.target.parentElement.parentElement);
    });
}
function reviewBook(bookElement){
    const uncompletedList = document.getElementById(UNCOMPLETE_BOOK_ID);

    const titleBook = bookElement.querySelector(".book-item > h3").innerText;
    const authorBook = bookElement.querySelector(".author").innerText;
    const yearBook = bookElement.querySelector(".year").innerText;

    const newBook = makeBook(titleBook, authorBook, yearBook, false);
    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isComplete = false;
    newBook[BOOK_ITEMID] = book.id;

    uncompletedList.append(newBook);

    bookElement.remove();
    updateDataToStorage();
}
function createReviewButton(){
    return createButton("green", "Baca Lagi", function(event){
        reviewBook(event.target.parentElement.parentElement);
    });
}

function booksLength() {
    const totalBook = document.getElementById("jumlahBuku");
    totalBook.innerText = books.length;
}

function filter() {
    const uncompletedList = document.getElementById(UNCOMPLETE_BOOK_ID);
    const searchInput = document.getElementById("searchBook").value.toLowerCase();

    for(let book of books){
        const newBook = makeBook(book.title, book.author, book.year, book.isComplete);
        let q = book[BOOK_ITEMID];
        if(q.toLowerCase().indexOf(searchInput) > -1){
            uncompletedList.append(q);
        }
    }
}


document.addEventListener("DOMContentLoaded", function(){

    submitForm.addEventListener("submit", function(event){
        event.preventDefault();

        submitForm.setAttribute("hidden", "true");
        addBookIcon.style.display = "flex";
        addBook();
    });

    iconAdd.addEventListener("click", () => {
        addBookIcon.style.display = "none";
        submitForm.removeAttribute("hidden");
    });

    document.getElementById("searchBook").onkeyup = filter();

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener('ondatasaved', () => {
    console.log("Data sudah tersimpan");
    booksLength();
});

document.addEventListener('ondataloaded', () => {
    refreshDataFromBook();
    booksLength();
});



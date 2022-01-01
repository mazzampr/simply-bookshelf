const STORAGE_KEY = "BOOKSHELF_APPS"
let books = [];

function isStorageExist() {
    if(typeof(Storage) === undefined) {
        alert("Browser tidak mendukung local storage");
        return false;
    }
    return true;
}

function saveData() {
    const parsedData = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsedData);
    document.dispatchEvent(new Event('ondatasaved'));
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if(data !== null)
        books = data;

    document.dispatchEvent(new Event('ondataloaded'));
}

function updateDataToStorage() {
    if(isStorageExist())
    
        saveData();
}

function composeBookObject(title, author, year, isComplete) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isComplete,
    }
}

function findBook(bookId){
    for(book of books){
        if(book.id === bookId)
            return book;
    }
    return null;
}

function findBookIndex(bookId) {
    let index = 0;
    for(book of books){
        if(book.id === bookId)
            return index;
       
        index++;
    }
    return -1;
}

function refreshDataFromBook() {
    const bookUncompleted = document.getElementById(UNCOMPLETE_BOOK_ID);
    let bookComplete = document.getElementById(COMPLETE_BOOK_ID);

    for(book of books){
        const newBook = makeBook(book.title, book.author, book.year, book.isComplete);
        newBook[BOOK_ITEMID] = book.id;

        if(book.isComplete){
            bookComplete.append(newBook);
        } else{
            bookUncompleted.append(newBook);
        }
    }
}


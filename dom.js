const UNCOMPLETED_LIST_BOOK_ID = "incompleteBookshelfList";
const COMPLETED_LIST_BOOK_ID = "completeBookshelfList"; 
const BOOK_ITEMID = "itemId";

function makeBook(data, author, timestamp, isCompleted) {
 
    const textTitle = document.createElement("h3");
    textTitle.innerText = data;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = author;
 
    const textTimestamp = document.createElement("h5");    
    textTimestamp.innerText = timestamp;


    const container = document.createElement("article");
    container.classList.add("book_item");
    container.append(textTitle, textAuthor, textTimestamp);

    if(isCompleted){
        container.append(
            createUndoButton(),
            createTrashButton());
    } else {
        container.append(
            createCheckButton(),
            createTrashButton());
        
    }
 
    return container;
}

function createUndoButton() {
    return createButton("green", "Belum selesai di Baca", function(event){
        undoTaskFromCompleted(event.target.parentElement);
    });
}

function createTrashButton() {
    return createButton("red", "Hapus buku",function(event){
        removeTaskFromCompleted(event.target.parentElement);
    });
}

function createCheckButton() {
    return createButton("green", "Selesai dibaca", function(event){
         addTaskToCompleted(event.target.parentElement);
    });
}

function createButton(buttonTypeClass, textButton, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.innerText = textButton;


    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}

function addBook() {
    const uncompletedBOOKList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID );
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);

    const textBook = document.getElementById("inputBookTitle").value;
    const authorBook = document.getElementById("inputBookAuthor").value;
    const timestamp = document.getElementById("inputBookYear").value;

    const checkBox = document.getElementById("inputBookIsComplete").checked;

    let book = makeBook(textBook, authorBook, timestamp, false);
    let bookObject = composeBookObject(textBook, authorBook, timestamp, false);

    if (checkBox) {
        book = makeBook(textBook, authorBook, timestamp, true);
        bookObject = composeBookObject(textBook, authorBook, timestamp, true);       

        listCompleted.append(book);
    } else {       
    
        uncompletedBOOKList.append(book);
    }

    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    updateDataToStorage();
}

function addTaskToCompleted(taskElement) {
    const taskTitle = taskElement.querySelector(".book_item > h3").innerText;
    const taskAuthor = taskElement.querySelector(".book_item > p").innerText;
    const taskTimestamp = taskElement.querySelector(".book_item > h5").innerText;
 
    const newBook = makeBook(taskTitle, taskAuthor, taskTimestamp, true);
    const book = findBook(taskElement[BOOK_ITEMID]);
    book.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;

    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    listCompleted.append(newBook);
    taskElement.remove();

    updateDataToStorage()
}

function removeTaskFromCompleted(taskElement) {
    const bookPosition = findBookIndex(taskElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);    
     
    document.getElementsByClassName("popup")[0].classList.add("active");
    taskElement.remove();     
    updateDataToStorage();
}

function undoTaskFromCompleted(taskElement){
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const taskTitle = taskElement.querySelector(".book_item > h3").innerText;
    const taskAuthor = taskElement.querySelector(".book_item > p").innerText;
    const taskTimestamp = taskElement.querySelector(".book_item > h5").innerText;
    
    const newBook = makeBook(taskTitle, taskAuthor, taskTimestamp, false);

    const book = findBook(taskElement[BOOK_ITEMID]);
    book.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;
    
    listUncompleted.append(newBook);
    taskElement.remove();

    updateDataToStorage();
}

const search = document.getElementById("searchBook");
search.addEventListener("keyup",searchBook);
function searchBook(element) {
   
    const cari = element.target.value.toLowerCase();
    let itemList = document.querySelectorAll(".book_item");

    itemList.forEach((item) => {
        const isi = item.firstChild.textContent.toLowerCase();
        if(isi.indexOf(cari) != -1) {
            item.setAttribute("style", "display: block;");
        } else {
            item.setAttribute("style", "display: none !important;");
        }
    });    
}
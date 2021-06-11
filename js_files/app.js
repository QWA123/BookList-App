// book class : represent a book
class Book {
  // a book object is created here
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI class : UI functions
class UI {
  /*
        static methods are defined inside class

        these method are called using 
            class_name.method(parameter)    :syntax   
        
    */

  static displayBooks() {
    const books = Store.getBooks();
    // now bring the things in internal storage to Display

    books.forEach(function (book) {
      UI.addBookToList(book);
    });

    // add each object in the books array to the table
    // in our html
  }

  static addBookToList(book) {
    // create a <tr> tag that stores the book sent to us
    // this <tr> tag is added to our <table>

    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `            
                 <td>${book.title}</td>
                 <td>${book.author}</td>
                 <td>${book.isbn}</td>
                 <td class="del-btn">Delete Me</td>`;

    list.appendChild(row);
  }

  // btn is the del button we clicked
  static deleteBook(btn) {
    btn.parentElement.remove();
  }

  // <div class="">message</div>  create this
  /*
            Create the div which shows the message        
        */
  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;

    div.appendChild(document.createTextNode(message));

    const container = document.querySelector(".container");

    const form = document.querySelector("#book-form");

    container.insertBefore(div, form);

    // vanish the alert in three seconds

    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3000);

    // perform the function() after 3000 milliseconds
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}
// Store Class : handles local storage
// ie no data lost on reload
/* static method helps us to call them without creating and
object of them ie no instantiation needed */

class Store {
  /*
    LocalStorage contains data as key-val pairs
    ie. object_name->obj_data

    LocalStorage stores data of (key,val) as a dataType String

    ie st="name:Jozo, Age:45" ---> overall dataType=String
    JSON.parse converts this String into objectType Structure
    or if st is multiple objects we get an Array of objects

    JSON.parse(st) gives 
    obj={
        name:Jozo,
        Age: 45
    }
    to return it to Org string state use JSON.stringify(data)
    */

  static getBooks() {
    // used to get the data stored in LocalStor
    let books;
    if (localStorage.getItem("books") === null) {
      books = []; // initialize empty array of objects
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    let books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
    // store new data back into localStorage as String DataType because it stores that only
  }

  static removeBook(isbn) {
    let books = Store.getBooks();

    books.forEach(function (book, index) {
      if (book.isbn == isbn) books.splice(index, 1);
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event : display books

// detect when the page is loaded and the books are displayed from the storage
//document.addEventListener("DOMContentLoaded", UI.displayBooks());
UI.displayBooks();
// Event :  add book

document.querySelector("#book-form").addEventListener("submit", function (e) {
  // prevent default action of SUBMIT ie reload
  e.preventDefault(); // the default action of event object 'e'
  /*
    'e' is an event object with a lot of properties
    eg: a click generates a 'click' object with properties such as
    location of click.
  */
  // extract values from the filled form
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  // check if the things we filled in form are correct

  if (title.trim() == "" || author.trim() == "" || isbn.trim() == "")
    UI.showAlert("Please fill in all fields", "danger");
  else {
    // create book object
    let book = new Book(title, author, isbn);

    // Add book to UI
    UI.addBookToList(book);

    // Add book to local Storage
    Store.addBook(book);

    UI.showAlert("Book Added", "success");

    // now clear the data we entered into input box
    UI.clearFields();
  }
});

// Event : Remove a book

document.querySelector("#book-list").addEventListener("click", function (e) {
  if (e.target.classList.contains("del-btn")) {
    // check if the target we clicked was a delete button
    let isb = e.target.previousElementSibling.innerText;
    UI.deleteBook(e.target); // delete book from UI

    Store.removeBook(isb); // delete book from local storage

    // two books might have same name in local storage
    // so remove using ISBN which is unique

    UI.showAlert("Book Deleted", "success");
  }
});

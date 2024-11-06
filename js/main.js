const books = [];
const RENDER_EVENT = 'render-books';

const generateId = () => +new Date();

const generateBookObject = (id, title, author, year, isComplete) => ({
  id,
  title,
  author,
  year,
  isComplete,
});

const addBook = () => {
  const bookTitle = document.getElementById('bookFormTitle').value;
  const bookAuthor = document.getElementById('bookFormAuthor').value;
  const bookYear = document.getElementById('bookFormYear').value;
  const bookIsComplete = document.getElementById('bookFormIsComplete').checked;
  
  const id = generateId();
  const bookObject = generateBookObject(id, bookTitle, bookAuthor, bookYear, bookIsComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  // console.log(bookObject);
};

const makeBookElement = (bookObject) => {
  const {id, title, author, year, isComplete} = bookObject;

  const titleText = document.createElement('h3');
  titleText.innerText = title;
  titleText.setAttribute('data-testid', title);

  const authorText = document.createElement('p');
  authorText.innerText = author;
  titleText.setAttribute('data-testid', author);

  const yearText = document.createElement('p');
  yearText.innerText = year;
  titleText.setAttribute('data-testid', year);

  const bookIsCompleteButton = document.createElement('button');
  bookIsCompleteButton.innerText = isComplete ? 'Tandai belum selesai dibaca' : 'Tandai selesai dibaca';

  const deleteBookButton = document.createElement('button');
  deleteBookButton.innerHTML = 'Hapus buku';
  
  const editBookButton = document.createElement('button');
  editBookButton.innerHTML = 'Edit buku';

  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.append(bookIsCompleteButton, deleteBookButton, editBookButton);

  const bookItem = document.createElement('div');
  bookItem.setAttribute('data-bookid', id);
  bookItem.setAttribute('data-testid', 'bookItem');
  bookItem.append(titleText, authorText, yearText, buttonsWrapper);

  return bookItem;
};

document.addEventListener(RENDER_EVENT, () => {
  const incompleteBookList = document.getElementById('incompleteBookList');
  incompleteBookList.innerHTML= '';

  const completeBookList = document.getElementById('completeBookList');
  completeBookList.innerHTML = '';

  books.map((book) => {
    const bookElement = makeBookElement(book);

    book.isComplete ? completeBookList.append(bookElement) : incompleteBookList.append(bookElement);
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('bookForm');

  submitForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addBook();
  });
});

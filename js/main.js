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
  bookIsCompleteButton.addEventListener('click', () => toggleIsComplete(id));

  const deleteBookButton = document.createElement('button');
  deleteBookButton.innerHTML = 'Hapus buku';
  deleteBookButton.addEventListener('click', () => removeBook(id));
  
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

const findBookIndex = (bookId) => {
  return books.findIndex((book) => book.id === bookId);
};

const countBookByCompletion = (completionStatus) => {
  return books.filter((book) => book.isComplete === completionStatus).length;
};

const addBook = () => {
  const bookTitle = document.getElementById('bookFormTitle').value;
  const bookAuthor = document.getElementById('bookFormAuthor').value;
  const bookYear = document.getElementById('bookFormYear').value;
  const bookIsComplete = document.getElementById('bookFormIsComplete').checked;
  
  const id = generateId();
  const bookObject = generateBookObject(id, bookTitle, bookAuthor, bookYear, bookIsComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const toggleIsComplete = (bookId) => {
  const selectedBookIndex = findBookIndex(bookId);

  if (selectedBookIndex < 0) return 'Buku tidak ditemukan.';

  books[selectedBookIndex].isComplete = !books[selectedBookIndex].isComplete;
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const removeBook = (bookId) => {
  const selectedBookIndex = findBookIndex(bookId);

  if (selectedBookIndex < 0) return 'Buku tidak ditemukan.';

  books.splice(selectedBookIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
};

document.addEventListener(RENDER_EVENT, () => {
  const incompleteBookList = document.getElementById('incompleteBookList');
  incompleteBookList.innerHTML= '';

  const incompleteCount = countBookByCompletion(false);
  const incompleteCountElement = document.getElementById('incompleteCount');
  incompleteCountElement.innerHTML = `${incompleteCount} buku`;
  
  if (incompleteCount === 0) {
    incompleteBookList.innerHTML = '<p>Rak buku masih kosong.</p>';
  }

  const completeBookList = document.getElementById('completeBookList');
  completeBookList.innerHTML = '';
  
  const completeCount = countBookByCompletion(true);
  const completeCountElement = document.getElementById('completeCount');
  completeCountElement.innerHTML = `${completeCount} buku`;
  
  if (completeCount === 0) {
    completeBookList.innerHTML = '<p>Rak buku masih kosong.</p>';
  }

  books.map((book) => {
    const bookElement = makeBookElement(book);

    book.isComplete ? completeBookList.append(bookElement) : incompleteBookList.append(bookElement);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const submitForm = document.getElementById('bookForm');

  submitForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addBook();
  });

  document.dispatchEvent(new Event(RENDER_EVENT));
});

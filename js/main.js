const RENDER_EVENT = 'render-books';
const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BOOKSHELF_APP';

const checkIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="check-icon">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>`;

const checkedIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="checked-icon">
    <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
  </svg>`;

const deleteIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" class="delete-icon" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>`;

const editIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" class="edit-icon" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>`;

const clearBookshelfIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
  </svg>`;

const books = [];
let filteredBooks = books;
let searchQuery = '';
let modalIsOpened = false;

const generateId = () => +new Date();

const isStorageExist = () => {
  if (typeof (Storage) === undefined) {
    alert('Browser tidak mendukung local storage.');
    return false;
  }
  return true;
};

const saveData = () => {
  if (isStorageExist()) {
    const stringifiedBooks = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, stringifiedBooks);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};

const loadDataFromStorage = () => {
  const dataFromStorage = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(dataFromStorage);

  if (data !== null) { books.push(...data); }

  document.dispatchEvent(new Event(RENDER_EVENT));
};

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
  authorText.innerText = `by ${author}`;
  authorText.setAttribute('data-testid', author);

  const yearText = document.createElement('p');
  yearText.innerText = year;
  yearText.setAttribute('data-testid', year);

  const authorYearWrapper = document.createElement('div');
  authorYearWrapper.classList.add('author-year-wrapper');
  authorYearWrapper.append(authorText, yearText);

  const bookDetailWrapper = document.createElement('div');
  bookDetailWrapper.classList.add('book-detail-wrapper');
  bookDetailWrapper.append(titleText, authorYearWrapper);
  
  const bookIsCompleteButton = document.createElement('button');
  bookIsCompleteButton.innerHTML = isComplete ? checkedIcon : checkIcon;
  bookIsCompleteButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  bookIsCompleteButton.addEventListener('click', () => toggleIsComplete(id));

  const deleteBookButton = document.createElement('button');
  deleteBookButton.innerHTML = deleteIcon;
  deleteBookButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteBookButton.setAttribute('data-target', 'book');
  deleteBookButton.setAttribute('data-id', id);
  deleteBookButton.classList.add('openDeleteModalButton');
  // deleteBookButton.addEventListener('click', () => removeBook(id));
  
  const editBookButton = document.createElement('button');
  editBookButton.innerHTML = editIcon;
  editBookButton.setAttribute('data-testid', 'bookItemEditButton');

  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.classList.add('book-buttons-wrapper');
  buttonsWrapper.append(bookIsCompleteButton, editBookButton, deleteBookButton);

  const bookItem = document.createElement('div');
  bookItem.classList.add('book-item');
  bookItem.setAttribute('data-bookid', id);
  bookItem.setAttribute('data-testid', 'bookItem');
  bookItem.append(bookDetailWrapper, buttonsWrapper);

  return bookItem;
};

const findBookIndex = (bookId) => {
  return books.findIndex((book) => book.id === bookId);
};

const countBookByCompletion = (booksArray, completionStatus) => {
  return booksArray.filter((book) => book.isComplete === completionStatus).length;
};

const addBook = () => {
  const bookTitle = document.getElementById('bookFormTitle').value;
  const bookAuthor = document.getElementById('bookFormAuthor').value;
  const bookYear = document.getElementById('bookFormYear').value;
  const bookIsComplete = document.getElementById('bookFormIsComplete').checked;
  
  const id = generateId();
  const bookObject = generateBookObject(id, bookTitle, bookAuthor, bookYear, bookIsComplete);
  books.push(bookObject);

  syncBookTitleSearch();
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const toggleIsComplete = (bookId) => {
  const selectedBookIndex = findBookIndex(bookId);

  if (selectedBookIndex < 0) return 'Book not found.';

  books[selectedBookIndex].isComplete = !books[selectedBookIndex].isComplete;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const removeBook = (bookId) => {
  const selectedBookIndex = findBookIndex(bookId);

  if (selectedBookIndex < 0) return 'Book not found.';

  books.splice(selectedBookIndex, 1);
  syncBookTitleSearch();
  closeModal();
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const clearBookshelf = (type) => {
  const isComplete = type === 'Complete';
  
  books.forEach((book, index) => {
    if (book.isComplete === isComplete) { books.splice(index, 1); }
  });

  syncBookTitleSearch();
  closeModal();
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const searchBookByTitle = (query) => {
  searchQuery = query;

  filteredBooks = books.filter((book) => book.title.toLowerCase()
    .includes(query.toLowerCase()));

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const syncBookTitleSearch = () => {
  filteredBooks = books;
  searchBookByTitle(searchQuery);
};

const setSubmitButtonText = (checked) => {
  const submitButton = document.querySelector('#bookFormSubmit span');
  submitButton.innerHTML = checked ? 'Finished Bookshelf' : 'Unfinished Bookshelf';
};

const makeDeleteModal = (modal, target, id) => {
  // console.log(target, id);
  const modalIcon = modal.querySelector('.modal-icon-indicator');
  const modalH2 = modal.querySelector('h2');
  const modalP = modal.querySelector('p');
  const modalConfirmButton = modal.querySelector('.modal-confirm-button');

  modalConfirmButton.classList.add('danger-button');

  if (target === 'book') {
    const bookIndex = findBookIndex(id);
    const selectedBook = books[bookIndex];

    modalIcon.innerHTML = deleteIcon;
    modalH2.innerHTML = 'Delete Book';
    modalP.innerHTML = `You are about to delete a book: <strong>'${selectedBook.title}'</strong>. Proceed to delete?'`;

    modalConfirmButton.addEventListener('click', () => removeBook(id));
  } else {
    modalIcon.innerHTML = clearBookshelfIcon;
    modalH2.innerHTML = `Clear ${id} Bookshelf`;
    modalP.innerHTML = `You are about to clear the <strong>${id} bookshelf</strong>. Proceed to clear?`;
    modalConfirmButton.innerHTML = 'Yes, clear it!';
    
    modalConfirmButton.addEventListener('click', () => clearBookshelf(id));
  }
};

const openModal = (modal, modalType, modalTarget, modalId) => {
  console.log(modalId)
  modalIsOpened = true;
  modal.style.display = 'block';

  if (modalType === 'delete') {
    makeDeleteModal(modal, modalTarget, modalId);
  }
};

const closeModal = () => {
  modalIsOpened = false;
  modal.style.display = 'none';
};

document.addEventListener(RENDER_EVENT, () => {
  const incompleteBookList = document.getElementById('incompleteBookList');
  incompleteBookList.innerHTML= '';
  
  const incompleteCount = countBookByCompletion(filteredBooks, false);
  const incompleteCountElement = document.getElementById('incompleteCount');
  incompleteCountElement.innerHTML = `${incompleteCount} books`;
  
  if (incompleteCount === 0) {
    incompleteBookList.innerHTML = '<p>Bookshelf empty.</p>';
  }

  const completeBookList = document.getElementById('completeBookList');
  completeBookList.innerHTML = '';
  
  const completeCount = countBookByCompletion(filteredBooks, true);
  const completeCountElement = document.getElementById('completeCount');
  completeCountElement.innerHTML = `${completeCount} books`;
  
  if (completeCount === 0) {
    completeBookList.innerHTML = '<p>Bookshelf empty.</p>';
  }

  filteredBooks.map((book) => {
    const bookElement = makeBookElement(book);

    book.isComplete ? completeBookList.append(bookElement) : incompleteBookList.append(bookElement);
  });

  const modalElement = document.getElementById('modal');

  const openDeleteModalButtons = document.querySelectorAll('.openDeleteModalButton');
  openDeleteModalButtons
    .forEach((btn) => {
      const modalTarget = btn.dataset.target;
      const modalId = modalTarget === 'book' ? parseInt(btn.dataset.id) : btn.dataset.id;

      btn.addEventListener('click', () => openModal(modalElement, 'delete', modalTarget, modalId));
    });
  
  const closeModalButtons = document.querySelectorAll('.closeModalButton');
  closeModalButtons
    .forEach((btn) => btn.addEventListener('click', () => closeModal()));
});

document.addEventListener('DOMContentLoaded', () => {
  const submitForm = document.getElementById('bookForm');

  submitForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addBook();
    document.dispatchEvent(new Event(RENDER_EVENT));
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const isCompleteCheckbox = document.getElementById('bookFormIsComplete');
  isCompleteCheckbox.addEventListener('change', () => setSubmitButtonText(isCompleteCheckbox.checked));

  const searchTitleElement = document.getElementById('searchBookTitle');
  searchTitleElement.addEventListener('input', () => searchBookByTitle(searchTitleElement.value));

  const modalElement = document.getElementById('modal');
  modalElement.style.display = 'none';
});

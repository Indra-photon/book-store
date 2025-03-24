
// DOM Element References
const listViewBtn = document.getElementById('listViewBtn');
const gridViewBtn = document.getElementById('gridViewBtn');
const bookList = document.getElementById('bookList');
const sortSelect = document.getElementById('sortSelect');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchContainer = document.querySelector('.search-container');
const bookModal = document.getElementById('bookModal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.querySelector('.close-modal');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loadingSpinner = document.getElementById('loadingSpinner');

// Clear Search Button
const clearButton = document.createElement('button');
clearButton.id = 'clearSearch';
clearButton.innerHTML = '<i class="fas fa-times"></i>';
clearButton.style.display = 'none';
searchInput.insertAdjacentElement('afterend', clearButton);

// Global Variables
let currentPage = 1;
let allLoadedBooks = []; // Storing all books loaded so far
let currentSearchTerm = ''; // Track current search term

// Event Listeners
listViewBtn.addEventListener('click', () => {
    listViewBtn.classList.add("active");
    gridViewBtn.classList.remove("active");
    bookList.classList.remove('grid-view');
    bookList.classList.add('list-view');
});

gridViewBtn.addEventListener('click', () => {
    listViewBtn.classList.remove("active");
    gridViewBtn.classList.add("active");
    bookList.classList.remove('list-view');
    bookList.classList.add('grid-view');
});

searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

searchInput.addEventListener('input', () => {
    clearButton.style.display = searchInput.value ? 'block' : 'none';
});

clearButton.addEventListener('click', () => {
    searchInput.value = '';
    clearButton.style.display = 'none';
    currentSearchTerm = '';
    displayBooks(allLoadedBooks);
});

sortSelect.addEventListener('change', () => {
    const sortBy = sortSelect.value;
    const sortedBooks = sortBooks(allLoadedBooks, sortBy);
    const filteredBooks = filterBooks(sortedBooks, currentSearchTerm);
    displayBooks(filteredBooks);
});

closeModal.addEventListener('click', () => {
    bookModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (event) => {
    if (event.target == bookModal) {
        bookModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadMoreBtn.addEventListener('click', loadMoreBooks);
    initializeBooks();
});


async function fetchBooks(page = 1, query = 'tech') {
    const url = `https://api.freeapi.app/api/v1/public/books?page=${page}&limit=8&inc=kind%252Cid%252Cetag%252CvolumeInfo&query=${query}`;
    const options = {method: 'GET', headers: {accept: 'application/json'}};

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data.data.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

function sortBooks(books, sortBy) {
    let sortedBooks = [...books];
    
    switch(sortBy) {
        case 'title':
            sortedBooks.sort((a, b) => {
                const titleA = a.volumeInfo.title.toUpperCase();
                const titleB = b.volumeInfo.title.toUpperCase();
                return titleA.localeCompare(titleB);
            });
            break;
            
        case 'title-desc':
            sortedBooks.sort((a, b) => {
                const titleA = a.volumeInfo.title.toUpperCase();
                const titleB = b.volumeInfo.title.toUpperCase();
                return titleB.localeCompare(titleA);
            });
            break;
            
        case 'newest':
            sortedBooks.sort((a, b) => {
                const dateA = new Date(a.volumeInfo.publishedDate || '0000');
                const dateB = new Date(b.volumeInfo.publishedDate || '0000');
                return dateB - dateA;
            });
            break;
            
        case 'oldest':
            sortedBooks.sort((a, b) => {
                const dateA = new Date(a.volumeInfo.publishedDate || '9999');
                const dateB = new Date(b.volumeInfo.publishedDate || '9999');
                return dateA - dateB;
            });
            break;
            
        default:
            break;
    }
    
    return sortedBooks;
}

function filterBooks(books, searchTerm) {
    if (!searchTerm) {
        return books;
    }
    
    return books.filter(book => {
        const title = book.volumeInfo.title?.toLowerCase() || '';
        const authors = book.volumeInfo.authors || [];
        const authorMatch = authors.some(author => 
            author.toLowerCase().includes(searchTerm)
        );
        
        return title.includes(searchTerm) || authorMatch;
    });
}

function handleSearch() {
    currentSearchTerm = searchInput.value.trim().toLowerCase();
    const filteredBooks = filterBooks(allLoadedBooks, currentSearchTerm);
    displayBooks(filteredBooks);
}

function showBookDetails(bookData) {
    const { 
        title, 
        subtitle, 
        authors = [], 
        publisher, 
        publishedDate, 
        description, 
        pageCount, 
        categories = [],
        language,
        imageLinks = {},
        infoLink
    } = bookData.volumeInfo;
    
    const imgSrc = imageLinks.thumbnail || imageLinks.smallThumbnail || '/api/placeholder/200/300';
    const authorsList = authors.join(', ');
    const categoriesList = categories.join(', ');
    
    modalContent.innerHTML = `
        <div class="modal-book-image">
            <img src="${imgSrc}" alt="${title}">
        </div>
        <div class="modal-book-text">
            <h2>${title}</h2>
            ${subtitle ? `<h3>${subtitle}</h3>` : ''}
            <p><strong>Author(s):</strong> ${authorsList || 'Not specified'}</p>
            <p><strong>Publisher:</strong> ${publisher || 'Not specified'}</p>
            <p><strong>Published Date:</strong> ${publishedDate || 'Not specified'}</p>
            ${pageCount ? `<p><strong>Pages:</strong> ${pageCount}</p>` : ''}
            ${categories && categories.length > 0 ? `<p><strong>Categories:</strong> ${categoriesList}</p>` : ''}
            <p><strong>Language:</strong> ${language || 'Not specified'}</p>
            
            <div class="book-description">
                <h4>Description:</h4>
                <p>${description || 'No description available.'}</p>
            </div>
            
            <a href="${infoLink}" class="view-more-btn" target="_blank">View on Google Books</a>
        </div>
    `;
    
    bookModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function createBookCard(bookData) {
    const title = bookData.volumeInfo.title || 'Unknown Title';
    const authors = bookData.volumeInfo.authors || ['Unknown Author'];
    const publisher = bookData.volumeInfo.publisher || 'Unknown Publisher';
    const publishedAt = bookData.volumeInfo.publishedDate || 'Unknown Date';
    const imgsrc = bookData.volumeInfo.imageLinks?.smallThumbnail || '/api/placeholder/120/180';

    const bookCard = document.createElement('div');
    bookCard.className = 'book-item';

    bookCard.innerHTML = `
        <div class="book-thumbnail">
            <img src="${imgsrc}" alt="Book cover">
        </div>
        <div class="book-info">
            <h3 class="book-title">${title}</h3>
            <p class="book-author">Authors: ${authors.join(', ')}</p>
            <p class="book-publisher">Publisher: ${publisher}</p>
            <p class="book-date">Published At: ${publishedAt}</p>
            <button class="view-more-btn">View Details</button>
        </div>
    `;

    bookCard.addEventListener('click', () => {
        showBookDetails(bookData);
    });

    const viewDetailsBtn = bookCard.querySelector('.view-more-btn');
    viewDetailsBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        showBookDetails(bookData);
    });

    return bookCard;
}

function displayBooks(books) {
    const booksContainer = document.getElementById('bookList');
    booksContainer.innerHTML = '';
    
    if (books.length === 0) {
        booksContainer.innerHTML = `
            <div class="no-results">
                <p>No books found. Try a different search term.</p>
            </div>
        `;
        return;
    }
    
    books.forEach(bookData => {
        const bookCard = createBookCard(bookData);
        booksContainer.appendChild(bookCard);
    });
}

async function initializeBooks() {
    loadingSpinner.classList.remove('hidden');
    
    try {
        const books = await fetchBooks();
        
        if (books.length === 0) {
            bookList.innerHTML = `
                <div class="no-results">
                    <p>No books found. Please try again later.</p>
                </div>
            `;
            loadMoreBtn.disabled = true;
            return;
        }
        
        
        allLoadedBooks = books;
        
        const sortBy = sortSelect.value;
        const sortedBooks = sortBooks(allLoadedBooks, sortBy);
        displayBooks(sortedBooks);
        
    } catch (error) {
        console.error('Error loading books:', error);
        bookList.innerHTML = `
            <div class="no-results">
                <p>Error loading books. Please try again later.</p>
            </div>
        `;
        loadMoreBtn.disabled = true;
    } finally {
        loadingSpinner.classList.add('hidden');
    }
}

async function loadMoreBooks() {
    loadMoreBtn.disabled = true;
    loadingSpinner.classList.remove('hidden');
    
    try {
        currentPage++;
        const moreBooks = await fetchBooks(currentPage);
        
        if (moreBooks.length === 0) {
            loadMoreBtn.textContent = 'No More Books';
            return;
        }
        
        // Add new books to the global array
        allLoadedBooks = [...allLoadedBooks, ...moreBooks];
        
        // Apply current filters and sorting to all books
        const sortBy = sortSelect.value;
        let processedBooks = sortBooks(allLoadedBooks, sortBy);
        
        if (currentSearchTerm) {
            processedBooks = filterBooks(processedBooks, currentSearchTerm);
        }
        
        // Display all books after processing
        displayBooks(processedBooks);
        
    } catch (error) {
        console.error('Error loading more books:', error);
    } finally {
        loadingSpinner.classList.add('hidden');
        loadMoreBtn.disabled = false;
    }
}
# 📚 Book Library

A modern, responsive web application for browsing and searching books using the FreeAPI.app service. This project demonstrates how to create a feature-rich front-end application that interacts with a REST API.

![Book Library Laptop View](/Demos/image.png)

## Deployment Link : ![Go Live](https://book-store-ten-cyan.vercel.app/)

## ✨ Features

- 📚 Fetch and display books from FreeAPI.app
- 🔍 Search books by title or author
- 🔄 Toggle between grid and list views
- ⬆️ Sort books by title or publication date
- 📱 Fully responsive design for all devices
- 📄 Pagination support with "Load More" functionality
- 📖 Detailed book information in a modal view
- 🎨 Modern UI with animations and visual feedback

## 🛠️ Technologies Used

- HTML5
- CSS3 (with modern features like CSS variables, flexbox, and grid)
- JavaScript (ES6+)
- FreeAPI.app for book data
- FontAwesome icons

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic understanding of HTML, CSS, and JavaScript
- Optional: Live server extension for your code editor

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/book-library.git
   ```

3. Open `index.html` in your browser or use a live server extension.

## 🔧 Project Structure

```
book-library/
├── index.html         # Main HTML file
├── style.css          # CSS styles
├── script.js          # JavaScript code
└── README.md          # Project documentation
```

## 💻 How to Use

1. **Browse Books**: On page load, books are automatically fetched and displayed.
2. **Switch Views**: Toggle between grid and list views using the buttons at the top.
3. **Search**: Enter a title or author name in the search box to filter books.
4. **Sort**: Use the dropdown to sort books by relevance, title, or publication date.
5. **Load More**: Click the "Load More" button at the bottom to fetch additional books.
6. **View Details**: Click on any book card or "View Details" button to see more information.

## 🌟 Key Code Features

### Dynamic Content Loading

```javascript
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
```

### Global State Management

```javascript
let allLoadedBooks = []; // Store all books loaded so far

// When loading more books
async function loadMoreBooks() {
    // ...
    const moreBooks = await fetchBooks(currentPage);
    // Add new books to the global array
    allLoadedBooks = [...allLoadedBooks, ...moreBooks];
    // ...
}
```

### Sorting & Filtering

```javascript
function sortBooks(books, sortBy) {
    // Sort books based on selected criteria
    // ...
}

function filterBooks(books, searchTerm) {
    // Filter books by title or author
    // ...
}
```

## 🎯 Learning Outcomes

This project demonstrates several important web development concepts:

- Working with async/await for API requests
- DOM manipulation in vanilla JavaScript
- Event handling and user interactions
- Responsive design principles
- Global state management in vanilla JS
- Search and filter functionality
- Sorting and pagination
- Modal implementation
- CSS animations and transitions

## 📝 API Information

This project uses the FreeAPI.app Books API. The API returns book data including:

- Title, subtitle, authors
- Publisher and publication date
- Book cover images
- Descriptions and categories
- Page count and language
- Links to more information
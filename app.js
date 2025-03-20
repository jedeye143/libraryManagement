let books = [
    { id: 1, title: "Noli Me Tangere", author: "José Rizal", isbn: "9789711790168", status: "available", cover: "mars2.png" },
    { id: 2, title: "El Filibusterismo", author: "José Rizal", isbn: "9789711790175", status: "borrowed", cover: "https://m.media-amazon.com/images/I/711HLGoYJQL._AC_UF1000,1000_QL80_.jpg" },
    { id: 3, title: "Banaag at Sikat", author: "Lope K. Santos", isbn: "9789715425974", status: "available", cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1275526742i/8366834.jpg" },
    { id: 4, title: "Florante at Laura", author: "Francisco Balagtas", isbn: "9789715690013", status: "available", cover: "https://aliatamiamalayao.wordpress.com/wp-content/uploads/2020/01/82715562_108114497296323_6495374325590261760_n-1.jpg" },
    { id: 5, title: "Dekada '70", author: "Lualhati Bautista", isbn: "9789715422225", status: "borrowed", cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1541742156i/42734737.jpg" },
    { id: 6, title: "GAPÔ", author: "Lualhati Bautista", isbn: "9789715422232", status: "available", cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1215489074i/1431556.jpg" },
    { id: 7, title: "America Is in the Heart", author: "Carlos Bulosan", isbn: "9780295952895", status: "available", cover: "https://1882foundation.org/wp-content/uploads/2019/07/america-is-in-the-heart.jpg" },
    { id: 8, title: "The Woman Who Had Two Navels", author: "Nick Joaquin", isbn: "9789715696114", status: "borrowed", cover: "https://upload.wikimedia.org/wikipedia/en/f/f2/The_Woman_Who_Had_Two_Navels_by_Nick_Joaquin_Book_Cover.jpg" },
    { id: 9, title: "Ilustrado", author: "Miguel Syjuco", isbn: "9780374174781", status: "available", cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1312051293i/6905480.jpg" },
    { id: 10, title: "Smaller and Smaller Circles", author: "F.H. Batacan", isbn: "9781616953980", status: "available", cover: "https://m.media-amazon.com/images/M/MV5BY2VkODYzNGEtMjA0Mi00YzliLWE1ODMtNDgwYjIxYmQxZTY3XkEyXkFqcGc@._V1_.jpg" }
];

books = books.map(book => ({
    ...book,
    summary: getBookDetails(book.title).summary,
    published: getBookDetails(book.title).published,
    language: getBookDetails(book.title).language
}));

const booksContainer = document.getElementById('books-container');
const bookModal = document.getElementById('book-modal');
const deleteModal = document.getElementById('delete-modal');
const emptyState = document.getElementById('empty-state');
const bookForm = document.getElementById('book-form');
const modalTitle = document.getElementById('modal-title');
const addBookBtn = document.getElementById('add-book-btn');
const sidebarAddBtn = document.getElementById('sidebar-add-btn');
const mobileAddBtn = document.getElementById('mobile-add-btn');
const emptyAddBtn = document.getElementById('empty-add-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelBtn = document.getElementById('cancel-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const searchInput = document.getElementById('search-input');
const sortBtn = document.getElementById('sort-btn');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.getElementById('sidebar');

const totalBooksEl = document.getElementById('total-books');
const availableBooksEl = document.getElementById('available-books');
const borrowedBooksEl = document.getElementById('borrowed-books');
const totalAuthorsEl = document.getElementById('total-authors');

const bookIdInput = document.getElementById('book-id');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const isbnInput = document.getElementById('isbn');
const statusInput = document.getElementById('status');
const coverInput = document.getElementById('cover');

let deleteBookId = null;
let sortDirection = 'asc';

function init() {
    renderBooks();
    updateStats();
    setupEventListeners();
}

function renderBooks(booksToRender = books) {
    booksContainer.innerHTML = '';
    
    if (booksToRender.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        
        booksToRender.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer';
            
            bookCard.addEventListener('click', (e) => {
                if (!e.target.closest('.edit-btn') && !e.target.closest('.delete-btn')) {
                    openBookPreview(book);
                }
            });
            
            const statusClass = book.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
            const statusText = book.status.charAt(0).toUpperCase() + book.status.slice(1);
            
            bookCard.innerHTML = `
                <div class="relative group">
                    <!-- Book Container -->
                    <div class="book-inner transform transition-all duration-300 hover:-translate-y-2 hover:rotate-[-3deg]">
                        <!-- Book Spine -->
                        <div class="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-l-sm"></div>
                        
                        <!-- Book Cover -->
                        <div class="ml-6 bg-white rounded-r-sm shadow-xl">
                            <!-- Book Cover Image -->
                            <div class="relative h-72 overflow-hidden rounded-tr-sm">
                                <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('${book.cover}')"></div>
                                <!-- Status Badge -->
                                <div class="absolute top-2 right-2">
                                    <span class="px-2 py-1 rounded-full text-xs font-medium ${statusClass}">
                                        ${statusText}
                                    </span>
                                </div>
                            </div>

                            <!-- Book Info -->
                            <div class="p-4 bg-white border-t border-gray-200">
                                <h3 class="text-lg font-bold text-gray-800 mb-1 line-clamp-1">${book.title}</h3>
                                <p class="text-gray-600 text-sm mb-1">
                                    <i class="bi bi-person-fill mr-1"></i> ${book.author}
                                </p>
                                <p class="text-gray-500 text-xs mb-4">
                                    <i class="bi bi-upc mr-1"></i> ISBN: ${book.isbn}
                                </p>
                                
                                <!-- Action Buttons -->
                                <div class="flex space-x-2">
                                    <button data-id="${book.id}" class="edit-btn flex-1 bg-blue-300 hover:bg-blue-400 text-black py-2 rounded flex items-center justify-center transition-colors duration-200">
                                        <i class="bi bi-pencil mr-1"></i> Edit
                                    </button>
                                    <button data-id="${book.id}" class="delete-btn flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded flex items-center justify-center transition-colors duration-200">
                                        <i class="bi bi-trash mr-1"></i> Delete
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Book Pages Effect -->
                        <div class="absolute right-0 top-0 bottom-0 w-1 bg-gray-200"></div>
                    </div>
                </div>
            `;
            
            booksContainer.appendChild(bookCard);
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEditClick);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDeleteClick);
        });
    }
}

function updateStats() {
    const totalBooks = books.length;
    const availableBooks = books.filter(book => book.status === 'available').length;
    const borrowedBooks = books.filter(book => book.status === 'borrowed').length;
    
    const uniqueAuthors = new Set(books.map(book => book.author));
    const totalAuthors = uniqueAuthors.size;
    
    totalBooksEl.textContent = totalBooks;
    availableBooksEl.textContent = availableBooks;
    borrowedBooksEl.textContent = borrowedBooks;
    totalAuthorsEl.textContent = totalAuthors;
}

function toggleSidebar() {
    if (sidebar.classList.contains('hidden')) {
        sidebar.classList.remove('hidden');
    } else {
        sidebar.classList.add('hidden');
    }
}

function setupEventListeners() {
    mobileMenuBtn.addEventListener('click', toggleSidebar);
    
    sidebarAddBtn.addEventListener('click', () => openModal());
    emptyAddBtn.addEventListener('click', () => openModal());
    
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    
    bookForm.addEventListener('submit', handleFormSubmit);
    
    confirmDeleteBtn.addEventListener('click', handleDeleteConfirm);
    
    searchInput.addEventListener('input', handleSearch);
    
    sortBtn.addEventListener('click', handleSort);
    
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            document.querySelectorAll('nav a').forEach(l => {
                l.classList.remove('bg-pink-50', 'text-pink-700');
                l.classList.add('hover:bg-gray-100');
            });
            
            link.classList.add('bg-pink-50', 'text-pink-700');
            link.classList.remove('hover:bg-gray-100');
            
            const text = link.innerText.trim();
            let filteredBooks = books;
            
            if (text === 'Available Books') {
                filteredBooks = books.filter(book => book.status === 'available');
            } else if (text === 'Borrowed Books') {
                filteredBooks = books.filter(book => book.status === 'borrowed');
            }
            
            renderBooks(filteredBooks);
            
            if (window.innerWidth < 768) {
                sidebar.classList.add('hidden');
            }
        });
    });

    closePreviewBtn.addEventListener('click', closeBookPreview);
    previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) {
            closeBookPreview();
        }
    });
}

function openModal(bookToEdit = null) {
    bookForm.reset();
    bookIdInput.value = '';
    
    if (bookToEdit) {
        modalTitle.textContent = 'Edit Book';
        bookIdInput.value = bookToEdit.id;
        titleInput.value = bookToEdit.title;
        authorInput.value = bookToEdit.author;
        isbnInput.value = bookToEdit.isbn;
        statusInput.value = bookToEdit.status;
        document.getElementById('summary').value = bookToEdit.summary || '';
        document.getElementById('published').value = bookToEdit.published || '';
        document.getElementById('language').value = bookToEdit.language || '';
        coverInput.value = '';  
    } else {
        modalTitle.textContent = 'Add New Book';
    }
    
    bookModal.classList.remove('hidden');
}

function closeModal() {
    bookModal.classList.add('hidden');
}

function openDeleteModal(id) {
    deleteBookId = id;
    deleteModal.classList.remove('hidden');
}

function closeDeleteModal() {
    deleteModal.classList.add('hidden');
    deleteBookId = null;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const bookId = bookIdInput.value;
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const isbn = isbnInput.value.trim();
    const status = statusInput.value;
    const summary = document.getElementById('summary').value.trim();
    const published = document.getElementById('published').value.trim();
    const language = document.getElementById('language').value.trim();
    const coverFile = coverInput.files[0];
    
    // Handle image upload
    let coverUrl = '';
    if (coverFile) {
        coverUrl = URL.createObjectURL(coverFile);
    } else if (bookId) {
        // If editing and no new image is uploaded, keep the existing cover
        const existingBook = books.find(book => book.id == bookId);
        coverUrl = existingBook ? existingBook.cover : '';
    }
    
    if (bookId) {
        // Edit existing book
        const index = books.findIndex(book => book.id == bookId);
        if (index !== -1) {
            books[index] = {
                id: parseInt(bookId),
                title,
                author,
                isbn,
                status,
                cover: coverUrl,
                summary,
                published,
                language
            };
        }
    } else {
        // Add new book
        const newId = books.length > 0 ? Math.max(...books.map(book => book.id)) + 1 : 1;
        const newBook = {
            id: newId,
            title,
            author,
            isbn,
            status,
            cover: coverUrl,
            summary,
            published,
            language
        };
        books.push(newBook);
    }
    
    // Update UI
    renderBooks();
    updateStats();
    closeModal();
}

// Handle edit button click
function handleEditClick(e) {
    const bookId = e.currentTarget.dataset.id;
    const bookToEdit = books.find(book => book.id == bookId);
    
    if (bookToEdit) {
        openModal(bookToEdit);
    }
}

function handleDeleteClick(e) {
    const bookId = e.currentTarget.dataset.id;
    openDeleteModal(bookId);
}

function handleDeleteConfirm() {
    if (deleteBookId) {
        books = books.filter(book => book.id != deleteBookId);
        renderBooks();
        updateStats();
        closeDeleteModal();
    }
}

function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.toLowerCase().includes(query)
    );
    renderBooks(filteredBooks);
}

// Handle sort functionality
function handleSort() {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    const sortedBooks = [...books].sort((a, b) => {
        if (sortDirection === 'asc') {
            return a.title.localeCompare(b.title);
        } else {
            return b.title.localeCompare(a.title);
        }
    });
    renderBooks(sortedBooks);
}

function getBookDetails(title) {
    const details = {
        "Noli Me Tangere": {
            summary: `"Noli Me Tangere" (Touch Me Not) is José Rizal's first and most famous novel, published in 1887. This masterpiece of Philippine literature serves as a scathing critique of Spanish colonial rule in the Philippines.

            The story follows Juan Crisóstomo Ibarra, a young Filipino who returns to the Philippines after seven years of study in Europe. He plans to open a modern school and marry his childhood sweetheart, María Clara, but finds himself entangled in the dark realities of Philippine society under Spanish rule.

            Through its rich cast of characters and intricate plot, the novel exposes the corruption of the Spanish colonial authorities and the Catholic church, while exploring themes of love, betrayal, social inequality, and the struggle for reform. The title, derived from the Latin phrase meaning "touch me not," refers to the cancer of society that the novel exposes.

            This groundbreaking work played a crucial role in the development of Filipino nationalism and ultimately contributed to the Philippine Revolution against Spanish colonial rule.`,
            published: "1887",
            language: "Spanish"
        },
        "El Filibusterismo": {
            summary: `"El Filibusterismo" (The Subversive), published in 1891, is the second novel by José Rizal and the sequel to "Noli Me Tangere." The story continues with a darker and more revolutionary tone, reflecting the author's growing disillusionment with the possibility of reform under Spanish rule.

            The novel follows the return of Crisóstomo Ibarra, now transformed into the wealthy jeweler Simoun, who has abandoned his idealistic nature in favor of a ruthless plan for revenge. Under the guise of supporting the Spanish regime, he secretly plots a revolution to overthrow the colonial government.

            Through its complex narrative, the novel explores themes of vengeance, transformation, and the moral costs of revolution. It serves as a profound meditation on the nature of justice, redemption, and the price of freedom.

            The term "filibusterismo" was used by Spanish authorities to condemn those who opposed their rule, marking them as subversives or pirates.`,
            published: "1891",
            language: "Spanish"
        },
    };
    
    return details[title] || {
        summary: "Summary not available for this book.",
        published: "N/A",
        language: "N/A"
    };
}

const previewModal = document.getElementById('book-preview-modal');
const previewContainer = previewModal.querySelector('.book-preview-container');
const previewCover = document.getElementById('preview-cover');
const previewTitle = document.getElementById('preview-title');
const previewAuthor = document.getElementById('preview-author');
const previewIsbn = document.getElementById('preview-isbn');
const previewSummary = document.getElementById('preview-summary');
const previewPublished = document.getElementById('preview-published');
const previewLanguage = document.getElementById('preview-language');
const closePreviewBtn = document.getElementById('close-preview-btn');

function openBookPreview(book) {
  
    previewCover.src = book.cover;
    previewTitle.textContent = book.title;
    previewAuthor.textContent = book.author;
    previewIsbn.textContent = `ISBN: ${book.isbn}`;
    previewSummary.textContent = book.summary;
    previewPublished.textContent = book.published;
    previewLanguage.textContent = book.language;

    const statusText = book.status === 'available' ? 'Available' : 'Borrowed';
    const statusClass = book.status === 'available' ? 
        'bg-green-100 text-green-800' : 
        'bg-red-100 text-red-800';

    const statusBadge = document.getElementById('preview-status');
    statusBadge.className = `px-3 py-1 rounded-full text-sm font-medium ${statusClass}`;
    statusBadge.textContent = statusText;

    document.getElementById('preview-status-bottom').textContent = statusText;

    previewModal.classList.remove('hidden');
    requestAnimationFrame(() => {
        previewContainer.classList.add('visible');
        setTimeout(() => {
            previewContainer.classList.add('open');
        }, 100);
    });
}
// Update the closeBookPreview function
function closeBookPreview() {
    previewContainer.classList.remove('open');
    setTimeout(() => {
        previewContainer.classList.remove('visible');
        setTimeout(() => {
            previewModal.classList.add('hidden');
        }, 300);
    }, 500);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !previewModal.classList.contains('hidden')) {
        closeBookPreview();
    }
});

init();
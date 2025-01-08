import { fetchCategories, fetchBooks } from './api.js';

class InfiniteBookList {
    constructor() {
        this.currentPage = 1;
        this.isLoading = false;
        this.hasMore = true;
        this.searchQuery = '';
        this.selectedCategory = '';
        this.sortOrder = 'title';

        this.initialize();
    }

    async initialize() {
        await this.loadCategories();
        await this.loadBooks(true);
        this.setupEventListeners();
        this.setupInfiniteScroll();
    }

    async loadCategories() {
        try {
            const categories = await fetchCategories();
            const select = document.getElementById('categoryFilter');

            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('카테고리 로드 실패:', error);
        }
    }

    async loadBooks(reset = false) {
        if (this.isLoading || (!this.hasMore && !reset)) return;

        try {
            this.isLoading = true;
            document.getElementById('loading').style.display = 'block';

            if (reset) {
                this.currentPage = 1;
                this.hasMore = true;
                document.getElementById('booksGrid').innerHTML = '';
            }

            const params = {
                page: this.currentPage,
                search: this.searchQuery,
                ordering: this.sortOrder
            };

            if (this.selectedCategory) {
                params.category = this.selectedCategory;
            }

            const response = await fetchBooks(params);
            this.displayBooks(response.results);

            this.hasMore = response.next !== null;
            if (this.hasMore) {
                this.currentPage++;
            }
        } catch (error) {
            console.error('도서 목록 로드 실패:', error);
        } finally {
            this.isLoading = false;
            document.getElementById('loading').style.display = 'none';
        }
    }

    displayBooks(books) {
        const booksGrid = document.getElementById('booksGrid');

        books.forEach(book => {
            const div = document.createElement('div');
            div.innerHTML = `
                <h3>${book.title}</h3>
                <p>저자: ${book.author}</p>
                <p>카테고리: ${book.category_name}</p>
                <p>출판일: ${new Date(book.publication_date).toLocaleDateString()}</p>
                <p>가격: ${book.price}</p>
                <p>재고: ${book.stock}</p>
                <hr>
            `;
            booksGrid.appendChild(div);
        });
    }

    setupInfiniteScroll() {
        window.addEventListener('scroll', () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
                this.loadBooks();
            }
        });
    }

    setupEventListeners() {
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.selectedCategory = e.target.value;
            this.loadBooks(true);
        });

        document.getElementById('searchButton').addEventListener('click', () => {
            this.searchQuery = document.getElementById('searchInput').value;
            this.loadBooks(true);
        });

        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.sortOrder = e.target.value;
            this.loadBooks(true);
        });
    }
}

// 인스턴스 생성
new InfiniteBookList();

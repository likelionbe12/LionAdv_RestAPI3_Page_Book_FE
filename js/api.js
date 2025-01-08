// API 기본 설정
const API_BASE_URL = 'http://localhost:8000/apiv1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 카테고리 조회
async function fetchCategories() {
    try {
        const response = await api.get('/categories/');
        return response.data.results;
    } catch (error) {
        console.error('카테고리 조회 실패:', error);
        throw error;
    }
}

// 도서 목록 조회
async function fetchBooks(params) {
    try {
        const response = await api.get('/books/', { params });
        return response.data;
    } catch (error) {
        console.error('도서 목록 조회 실패:', error);
        throw error;
    }
}

// API 함수들을 외부에서 사용할 수 있도록 export
export { fetchCategories, fetchBooks };

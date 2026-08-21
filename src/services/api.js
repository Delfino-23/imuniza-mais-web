import axios from 'axios';

const api = axios.create({

    // baseURL: 'http://localhost:4000/api',
    baseURL: 'https://imuniza-mais-api.onrender.com/api',

    headers: {
        'Content-Type': 'application/json'
    }

});

export default api;
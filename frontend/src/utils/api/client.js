import axios from 'axios';

const client = axios.create({
	baseURL: 'http://192.168.1.200:3001/api',
});

export default client;

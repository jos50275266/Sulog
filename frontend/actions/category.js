import fetch from 'isomorphic-fetch';
import { API } from '../config';
import { handleResponse } from './auth';

export const create = (tag, token) => {
	return fetch(`${API}/tag`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'x-auth-token': `${token}`
		},
		body: JSON.stringify(tag)
	})
		.then((response) => {
			if (response.status === 401) return handleResponse(response);
			else return response.json();
		})
		.catch((err) => console.log(err));
};

export const getCategories = () => {
	return fetch(`${API}/categories`, {
		method: 'GET'
	})
		.then((response) => response.json())
		.catch((err) => console.log(err));
};

export const singleCategory = (slug) => {
	return fetch(`${API}/tag/${slug}`, {
		method: 'GET'
	})
		.then((response) => response.json())
		.catch((err) => console.log(err));
};

export const removeCategory = (slug, token) => {
	return fetch(`${API}/tag/${slug}`, {
		method: 'DELETE',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'x-auth-token': `${token}`
		}
	})
		.then((response) => {
			if (response.status === 401) return handleResponse(response);
			else return response.json();
		})
		.catch((err) => console.log(err));
};

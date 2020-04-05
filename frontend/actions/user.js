import fetch from 'isomorphic-fetch';
import { API } from '../config';
import { handleResponse } from './auth';

export const userPublicProfile = (username) => {
	return fetch(`${API}/user/${username}`, {
		method: 'GET',
		headers: {
			Accept: 'application/json'
		}
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getProfile = (token) => {
	return fetch(`${API}/user/profile`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'x-auth-token': `${token}`
		}
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const update = (token, user) => {
	return fetch(`${API}/user/update`, {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			'x-auth-token': `${token}`
		},
		body: user
	})
		.then((response) => {
			if (response.status === 401) {
				return handleResponse(response);
			} else {
				return response.json();
			}
		})
		.catch((err) => console.log(err));
};

export const writerData = (username) => {
	return fetch(`${API}/user/writer/${username}`, {
		method: 'GET',
		headers: {
			Accept: 'application/json'
		}
	})
		.then((response) => {
				response.json();
		})
		.catch((err) => console.log(err));
};

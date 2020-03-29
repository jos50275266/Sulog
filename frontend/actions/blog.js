import fetch from 'isomorphic-fetch';
import queryString from 'query-string';
import { API } from '../config';
import { isAuth, handleResponse } from './auth';
// import { getCookie } from '../actions/authHelpers';

export const createBlog = (blog, token) => {
	let createBlogEndPoint;
	// let token = getCookie('token');

	if (isAuth() && isAuth().role === 1) createBlogEndPoint = `${API}/blog`;
	else if (isAuth() && isAuth().role === 0) createBlogEndPoint = `${API}/user/blog`;

	return fetch(`${createBlogEndPoint}`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'x-auth-token': `${token}`
		},
		body: blog
	})
		.then((response) => {
			if (response.status === 401) return handleResponse(response);
			else return response.json();
		})
		.catch((err) => console.log(err));
};

export const listBlogsWithCategoriesAndTags = () => {
	return fetch(`${API}/blogs-categories-tags`, {
		method: 'POST',
		headers: {
			Accept: 'application/json'
		}
	})
		.then((response) => response.json())
		.catch((err) => console.log(err));
};

export const singleBlog = (slug) => {
	return fetch(`${API}/blog/${slug}`, {
		method: 'GET'
	})
		.then((response) => response.json())
		.catch((err) => console.log(err));
};

export const listRelated = (blog) => {
	return fetch(`${API}/blogs/related`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(blog)
	})
		.then((response) => response.json())
		.catch((err) => console.log(err));
};

export const list = (username) => {
	let listBlogsEndpoint;

	if (username) {
		listBlogsEndpoint = `${API}/${username}/blogs`;
	} else {
		listBlogsEndpoint = `${API}/blogs`;
	}

	return fetch(`${listBlogsEndpoint}`, {
		method: 'GET'
	})
		.then((response) => response.json())
		.catch((err) => console.log(err));
};

export const removeBlog = (slug, token) => {
	let deleteBlogEndpoint;

	if (isAuth() && isAuth().role === 1) deleteBlogEndpoint = `${API}/blog/${slug}`;
	else if (isAuth() && isAuth().role === 0) deleteBlogEndpoint = `${API}/user/blog/${slug}`;

	return fetch(`${deleteBlogEndpoint}`, {
		method: 'DELETE',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'x-auth-token': `${token}`
		}
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

export const updateBlog = (blog, token, slug) => {
	let updateBlogEndpoint;

	if (isAuth() && isAuth().role === 1) updateBlogEndpoint = `${API}/blog/${slug}`;
	else if (isAuth() && isAuth().role === 0) updateBlogEndpoint = `${API}/user/blog/${slug}`;

	return fetch(`${updateBlogEndpoint}`, {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			'x-auth-token': `${token}`
		},
		body: blog
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

export const listSearch = (params) => {
	// console.log("Search Params", params);
	let query = queryString.stringify(params);
	// console.log("query parans", query);
	return fetch(`${API}/blogs/search?${query}`, {
		method: 'GET'
	})
		.then((response) => response.json())
		.catch((err) => console.log(err));
};

export const like = (slug) => {
	return fetch(`${API}/user/like/${slug}`, {
		method: 'GET'
	})
		.then((response) => response.json())
		.catch((err) => console.log(err));
};

export const likeUpdate = (slug, token) => {
	return fetch(`${API}/user/like/${slug}`, {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'x-auth-token': `${token}`
		}
	})
		.then((response) => response.json())
		.catch((err) => console.log(err));
};

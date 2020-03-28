import fetch from 'isomorphic-fetch';
import { API } from '../config';
import Router from 'next/router';
import { setCookie, getCookie, removeCookie, setLocalStorage, removeLocalStorage } from '../actions/authHelpers';

const tokenKey = 'token';
const key = 'user';

export const handleResponse = (response) => {
	logout(() => {
		Router.push({
			pathname: '/signin',
			query: {
				message: '세션이 만료되었습니다. 다시 로그인해주세요...'
			}
		});
	});
};

export const preSignup = (user) => {
	return fetch(`${API}/pre-signup`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(user)
	})
		.then((response) => {
			if ((response.status >= 200) & (response.status < 300)) {
				alert('회원가입성공!');
				return response.json();
			} else {
				alert('회원가입에 문제가 발생했습니다. 다시 시도해주세요!');
				// console.log(response);
				return response.json();
			}
		})
		.catch((err) => console.log(err));
};

export const signup = (user) => {
	return fetch(`${API}/signup`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(user)
	})
		.then((response) => {
			if (response.status >= 200 && response.status < 300) {
				alert('회원가입성공!');
				return response.json();
			} else {
				alert('회원가입에 문제가 발생했습니다. 다시 시도해주세요!');
				return response.json();
			}
		})
		.catch((err) => console.log(err));
};

export const signin = (user) => {
	return fetch(`${API}/signin`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(user)
	})
		.then((response) => {
			if (response.status >= 200 && response.status < 300) {
				alert('로그인 성공!');
				// console.log(response.json());
				return response.json();
			} else {
				return response.json();
			}
		})
		.catch((err) => console.log(err));
};

export const logout = (next) => {
	removeCookie(tokenKey);
	removeLocalStorage(key);
	next();

	return;
};

export const authenticate = (data, next) => {
	const { token, user } = data;
	setCookie(tokenKey, token);
	setLocalStorage(key, user);
	next();
};

export const isAuth = () => {
	if (process.browser) {
		const cookieChecker = getCookie(tokenKey);
		if (cookieChecker) {
			if (localStorage.getItem(key)) return JSON.parse(localStorage.getItem(key));
			else return false;
		}
	}
};

export const updateUser = (user, next) => {
	if (process.browser) {
		if (localStorage.getItem(key)) {
			let auth = user;
			localStorage.setItem(key, JSON.stringify(auth));
			next();
		}
	}
};

export const loginWithGoogle = (user) => {
	return fetch(`${API}/google-login`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(user)
	})
		.then((response) => {
			if (response.status >= 200 && response.status < 300) {
				alert('구글 로그인 성공!');
				return response.json();
			} else {
				alert('구글 로그인에 문제가 발생했습니다. 다시 시도해주세요!');
				console.log(response);
			}
		})
		.catch((err) => console.log(err));
};

export const forgotPassword = (email) => {
	return fetch(`${API}/forgot-password`, {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(email)
	})
		.then((response) => {
			if (response.status >= 200 && response.status < 300) {
				return response.json();
			}
		})
		.catch((err) => console.log(err));
};

export const resetPassword = (resetInfo) => {
	return fetch(`${API}/reset-password`, {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(resetInfo)
	})
		.then((response) => {
			if (response.status >= 200 && response.status < 300) {
				return response.json();
			} else {
				return response.json();
			}
		})
		.catch((err) => console.log(err));
};

import { useState, useEffect } from 'react';
import { signin, isAuth, authenticate } from '../../actions/auth';
import Router from 'next/router';
import Link from 'next/link';
import LoginGoogle from './LoginGoogle';

const SigninComponent = () => {
	const [ values, setValues ] = useState({
		email: '',
		password: '',
		error: '',
		loading: false,
		message: '',
		showForm: true
	});

	const { email, password, error, loading, message, showForm } = values;

	useEffect(() => {
		isAuth() && Router.push('/');
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		setValues({ ...values, loading: true, error: false });

		const user = { email, password };

		signin(user)
			.then((data) => {
				console.log(data);
				if (data.error) {
					setValues({ ...values, error: data.error, loading: false });
				} else {
					authenticate(data, () => {
						if (isAuth() && isAuth().role === 1) Router.push('/admin');
						else Router.push('/');
					});
				}
			})
			.catch((err) => console.log(err));
	};

	const handleChange = (name) => (e) => {
		setValues({ ...values, error: false, [name]: e.target.value });
	};

	const showLoading = () => (loading ? <div className="alert alert-info">로딩중...</div> : '');
	const showError = () => (error ? <div className="alert alert-danger">{error}</div> : '');
	const showMessage = () => (message ? <div className="alert alert-info">{message}</div> : '');

	const signinForm = () => {
		return (
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<input
						value={email}
						onChange={handleChange('email')}
						type="email"
						className="form-control"
						placeholder="이메일을 입력해주세요..."
					/>
				</div>

				<div className="form-group">
					<input
						value={password}
						onChange={handleChange('password')}
						type="password"
						className="form-control"
						placeholder="비밀번호를 입력해주세요..."
					/>
				</div>

				<div>
					<button className="btn btn-primary">로그인</button>
				</div>
			</form>
		);
	};

	return (
		<React.Fragment>
			{showError()}
			{showLoading()}
			{showMessage()}
			<LoginGoogle />
			{showForm && signinForm()}
			<br />
			<Link href="/auth/password/forgot">
				<a className="btn btn-outline-danger btn-sm">비밀번호 분실/변경</a>
			</Link>
		</React.Fragment>
	);
};

export default SigninComponent;

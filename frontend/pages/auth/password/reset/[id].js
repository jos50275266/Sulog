import Layout from '../../../../components/Layout';
import { useState, useEffect } from 'react';
import { withRouter } from 'next/router';
import { resetPassword, isAuth } from '../../../../actions/auth';

const ResetPassword = ({ router }) => {
	const [ values, setValues ] = useState({
		name: '',
		newPassword: '',
		confirmedPassword: '',
		error: '',
		message: '',
		showForm: true
	});

	useEffect(() => {
		isAuth() && router.push('/');
	});

	const { name, newPassword, confirmedPassword, error, message } = values;

	const handleSubmit = (e) => {
		e.preventDefault();
		if (newPassword === confirmedPassword) {
			resetPassword({
				newPassword,
				resetPasswordLink: router.query.id
			})
				.then((data) => {
					console.log(data);
					if (data.error) {
						setValues({
							...values,
							error: data.error,
							showForm: false,
							newPassword: '',
							confirmedPassword: ''
						});
						setTimeout(() => {
							router.push('/auth/password/forgot');
						}, 1000);
					} else {
						setValues({
							...values,
							error: data.error,
							showForm: false,
							message: data.message,
							newPassword: '',
							confirmedPassword: ''
						});
						setTimeout(() => {
							router.push('/signin');
						}, 1000);
					}
				})
				.catch((err) => console.log(err));
		} else {
			setValues({ ...values, error: '비밀번호가 일치하지않습니다.' });
		}
	};

	const passwordResetForm = () => (
		<form onSubmit={handleSubmit}>
			<div className="form-group">
				<input
					type="password"
					onChange={(e) => setValues({ ...values, newPassword: e.target.value })}
					className="form-control"
					value={newPassword}
					placeholder="변경할 비밀번호를 입력해주세요..."
					required
				/>
			</div>
			<div className="form-group">
				<input
					type="password"
					onChange={(e) => setValues({ ...values, confirmedPassword: e.target.value })}
					className="form-control"
					value={confirmedPassword}
					placeholder="비밀번호를 한번 더 입력해주세요..."
					required
				/>
			</div>
			<div>
				<button className="btn btn-primary">비밀번호 변경하기</button>
			</div>
		</form>
	);

	const showError = () => (error ? <div className="alert alert-danger">{error}</div> : '');
	const showMessage = () => (message ? <div className="alert alert-success">{message}</div> : '');

	return (
		<Layout>
			<div className="container">
				<h2>패스워드 변경</h2>
				<hr />
				{showError()}
				{showMessage()}
				{passwordResetForm()}
			</div>
		</Layout>
	);
};

export default withRouter(ResetPassword);

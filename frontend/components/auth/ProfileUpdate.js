import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import { updateUser } from '../../actions/auth';
import { getCookie } from '../../actions/authHelpers';
import { getProfile, update } from '../../actions/user';
import { API } from '../../config';

const ProfileUpdate = () => {
	const [ values, setValues ] = useState({
		username: '',
		name: '',
		email: '',
		about: '',
		password: '',
		error: false,
		success: false,
		loading: false,
		photo: '',
		userData: ''
	});

	const token = getCookie('token');

	const { username, name, email, about, password, error, success, loading, photo, userData } = values;

	const init = () => {
		getProfile(token).then((data) => {
			if (data.error) {
				setValues({ ...values, error: data.error });
			} else {
				setValues({
					...values,
					username: data.username,
					name: data.name,
					email: data.email,
					about: data.about
				});
			}
		});
	};

	useEffect(() => {
		init();
	}, []);

	const handleChange = (name) => (e) => {
		const value = name === 'photo' ? e.target.files[0] : e.target.value;
		let userFormData = new FormData();
		userFormData.set(name, value);
		setValues({ ...values, [name]: value, userData: userFormData, error: false, success: false });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setValues({ ...values, loading: true });
		update(token, userData)
			.then((data) => {
				if (data.error) {
					setValues({ ...values, error: data.error, success: false, loading: false });
				} else {
					updateUser(data, () => {
						setValues({
							...values,
							username: data.username,
							name: data.name,
							email: data.email,
							about: data.about,
							password: '',
							success: true,
							loading: false
						});
					});

					alert('성공적으로 프로필이 업데이트 되었습니다.');
					Router.push('/blogs');
				}
			})
			.catch((err) => console.log(err));
	};

	const showError = () => (
		<div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
			{error}
		</div>
	);

	const showSuccess = () => (
		<div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
			프로필이 성공적으로 업데이트되었습니다...
		</div>
	);

	const showLoading = () => (
		<div className="alert alert-info" style={{ display: loading ? '' : 'none' }}>
			로딩중...
		</div>
	);

	const profileUpdateForm = () => (
		<form onSubmit={handleSubmit}>
			<div className="form-group">
				<label className="btn btn-outline-info">
					프로필 사진
					<input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
				</label>
			</div>
			<div className="form-group">
				<label className="text-muted">Username</label>
				<input onChange={handleChange('username')} type="text" value={username} className="form-control" />
			</div>
			<div className="form-group">
				<label className="text-muted">Name</label>
				<input onChange={handleChange('name')} type="text" value={name} className="form-control" />
			</div>
			<div className="form-group">
				<label className="text-muted">
					Email: <small>이메일은 규정상 업데이트가 불가능합니다...</small>
				</label>
				<input onChange={handleChange('email')} type="text" value={email} className="form-control" />
			</div>
			<div className="form-group">
				<label className="text-muted">About</label>
				<textarea onChange={handleChange('about')} type="text" value={about} className="form-control" />
			</div>
			<div className="form-group">
				<label className="text-muted">Password</label>
				<input onChange={handleChange('password')} type="password" value={password} className="form-control" />
			</div>
			<div>
				<button type="submit" className="btn btn-primary">
					프로필 업데이트
				</button>
			</div>
		</form>
	);

	return (
		<React.Fragment>
			<div className="container">
				<div className="row">
					<div className="col-md-4">
						<img
							src={`${API}/user/photo/${username}`}
							className="img img-fluid img-thumbnail mb-3"
							style={{ maxHeight: 'auto', maxWidth: '100%' }}
							alt="user profile"
						/>
					</div>
					<div className="col-md-8 mb-5">
						{showSuccess()}
						{showError()}
						{showLoading()}
						{profileUpdateForm()}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default ProfileUpdate;

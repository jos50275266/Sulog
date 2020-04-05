import Router from 'next/router';
// Methods
import { getCookie } from '../../actions/authHelpers';
import { getTags } from '../../actions/tag';
import { getCategories } from '../../actions/category';
import { createBlog } from '../../actions/blog';
// React
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import '../../node_modules/react-quill/dist/quill.snow.css';
import { QuillModules, QuillFormats } from '../../helper/quill';

// withRouter 사용하면 props으로 router을 받을 수 있다.
const CreateBlog = ({ router }) => {
	const blogFromLS = () => {
		if (typeof window === 'undefined') {
			return false;
		}

		if (localStorage.getItem('blog')) {
			return JSON.parse(localStorage.getItem('blog'));
		} else {
			return false;
		}
	};

	const [ categories, setCategories ] = useState([]);
	const [ tags, setTags ] = useState([]);

	const [ checked, setChecked ] = useState([]);
	const [ checkedTag, setCheckedTag ] = useState([]);

	const [ body, setBody ] = useState(blogFromLS());
	const [ values, setValues ] = useState({
		error: '',
		sizeError: '',
		success: '',
		formData: '',
		title: '',
		excerpt: '',
		hidePublishButton: false
	});

	const { error, sizeError, success, formData, title, excerpt, hidePublishButton } = values;

	const token = getCookie('token');

	const initCategories = () => {
		getCategories()
			.then((data) => {
				if (data.error) setValues({ ...values, error: data.error });
				else setCategories(data);
			})
			.catch((err) => console.log(err));
	};

	const initTags = () => {
		getTags()
			.then((data) => {
				if (data.error) setValues({ ...values, error: data.error });
				else setTags(data);
			})
			.catch((err) => console.log(err));
	};

	useEffect(
		() => {
			setValues({ ...values, formData: new FormData() });
			initCategories();
			initTags();
		},
		[ router ]
	);

	const publishBlog = (e) => {
		e.preventDefault();

		createBlog(formData, token)
			.then((data) => {
				if (data === undefined) {
					return false;
				} else if (data.error) {
					setValues({ ...values, error: data.error });
				} else {
					alert('글 생성 성공');
					setValues({
						...values,
						title: '',
						error: '',
						success: `${data.title} 제목의 새로운 글이 생성되었습니다.`
					});

					setBody('');
					setCategories([]);
					setTags([]);

					Router.push('/blogs');
				}
			})
			.catch((err) => console.log(err));
	};

	const handleChange = (name) => (e) => {
		const value = name === 'photo' ? e.target.files[0] : e.target.value;
		formData.set(name, value);

		setValues({
			...values,
			[name]: value,
			formData,
			error: '',
			success: '',
			error: ''
		});
	};

	const handleBody = (e) => {
		// console.log(e);
		setBody(e);
		formData.set('body', e);
		if (typeof window !== 'undefined') {
			localStorage.setItem('blog', JSON.stringify(e));
		}
	};

	const handleToggle = (c) => () => {
		setValues({ ...values, error: '' });
		// return the first index or -1
		const clickedCategory = checked.indexOf(c);
		const all = [ ...checked ];

		if (clickedCategory === -1) {
			all.push(c);
		} else {
			all.splice(clickedCategory, 1);
		}
		console.log(all);
		setChecked(all);
		formData.set('categories', all);
	};

	const handleTagsToggle = (t) => () => {
		setValues({ ...values, error: '' });
		// return the first index or -1
		const clickedTag = checked.indexOf(t);
		const all = [ ...checkedTag ];

		if (clickedTag === -1) {
			all.push(t);
		} else {
			all.splice(clickedTag, 1);
		}
		console.log(all);
		setCheckedTag(all);
		formData.set('tags', all);
	};

	const showCategories = () => {
		return (
			categories &&
			categories.map((c, i) => (
				<li key={i} className="list-unstyled">
					<input onChange={handleToggle(c._id)} type="checkbox" className="mr-2" />
					<label className="form-check-label">{c.name}</label>
				</li>
			))
		);
	};

	const showTags = () => {
		return (
			tags &&
			tags.map((t, i) => (
				<li key={i} className="list-unstyled">
					<input onChange={handleTagsToggle(t._id)} type="checkbox" className="mr-2" />
					<label className="form-check-label">{t.name}</label>
				</li>
			))
		);
	};

	const showError = () => (
		<div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
			{error}
		</div>
	);

	const showSuccess = () => (
		<div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
			{success}
		</div>
	);

	const createBlogForm = () => {
		return (
			<form onSubmit={publishBlog}>
				<div className="form-group">
					<label className="text-muted">제목</label>
					<input type="text" className="form-control" value={title} onChange={handleChange('title')} />
				</div>
				<div className="form-group">
					<label className="text-muted">소개</label>
					<input type="text" className="form-control" value={excerpt} onChange={handleChange('excerpt')} />
				</div>
				<div className="form-group">
					<ReactQuill
						modules={QuillModules}
						formats={QuillFormats}
						value={body}
						placeholder="Write something amazing..."
						onChange={handleBody}
						theme="snow"
					/>
				</div>

				<div>
					<button type="submit" className="btn btn-primary">
						출간하기
					</button>
				</div>
			</form>
		);
	};

	return (
		<div className="container-fluid">
			<div className="pb-3">
				{showError()}
				{showSuccess()}
			</div>
			<div className="row">
				<div className="col-md-8">{createBlogForm()}</div>
				<div className="col-md-4">
					<div>
						<div className="form-group pb-2">
							<h5>이미지 등록: 최대 크기: 1mb</h5>
							<hr />

							<label className="btn btn-outline-info">
								이미지 등록하기
								<input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
							</label>
						</div>
					</div>

					<div>
						<h5>카테고리</h5>
						<hr />
						<ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>{showCategories()}</ul>
					</div>

					<div>
						<h5>태그</h5>
						<ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>{showTags()}</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withRouter(CreateBlog);

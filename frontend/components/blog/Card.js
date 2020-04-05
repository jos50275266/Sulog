import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { API } from '../../config';
import { getCookie } from '../../actions/authHelpers';
import { like, likeUpdate } from '../../actions/blog';
import '../../public/style.css';

const Card = ({ blog }) => {
	const [ numOfLike, setNumOfLike ] = useState(0);

	const initializeNumOfLike = () => {
		like(blog.slug).then((data) => setNumOfLike(data.like.length)).catch((err) => console.log(err));
	};

	useEffect(() => {
		initializeNumOfLike();
	}, []);

	const updateNumOfLike = () => {
		const token = getCookie('token');

		if (token) {
			likeUpdate(blog.slug, token)
				.then((data) => setNumOfLike(data.like.length))
				.catch((err) => console.log(err));
		} else {
			alert('좋아요를 누르기 위해서는 로그인이 필요합니다!');
		}
	};

	const showBlogCategories = (blog) =>
		blog.categories.map((c, i) => (
			<Link key={i} href={`/categories/${c.slug}`}>
				<span className="badge badge-pill badge-primary p-2">{c.name}</span>
			</Link>
		));

	const showBlogTags = (blog) =>
		blog.tags.map((t, i) => (
			<Link key={i} href={`/tags/${t.slug}`}>
				<a className="badge badge-pill badge-secondary p-2">{t.name}</a>
			</Link>
		));

	return (
		<section className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 bg-white border border-white">
			<article>
				<ul className="blog-post">
					<li>
						<img
							className="img-responsive"
							src={`${API}/blog/photo/${blog.slug}`}
							alt="해당 포스트는 이미지가 존재하지않습니다."
						/>
						<h3 className="mt-3">
							<strong>{blog.title}</strong>
						</h3>
						<p>{blog.excerpt}</p>

						<section className="button">
							<Link href={`/blogs/${blog.slug}`}>
								<a className="text-light">
									<b>더보기...</b>
								</a>
							</Link>
						</section>
						<br />

						<p>
							{showBlogCategories(blog)}
							<br />
							{showBlogTags(blog)}
						</p>
						<b>{moment(blog.updatedAt).format('LLL')}</b>

						<section>
							<hr />
							<b>By </b>
							<Link href={`/profile/${blog.postedBy.username}`}>
								<a>{blog.postedBy.name}</a>
							</Link>
							<label className="float-right">
								<FontAwesomeIcon icon="heart" onClick={updateNumOfLike} style={{ color: 'red' }} />
								&nbsp;
								{numOfLike}
							</label>
						</section>
					</li>
				</ul>
			</article>
		</section>
	);
};

export default Card;

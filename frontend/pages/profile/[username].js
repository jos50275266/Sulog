import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { userPublicProfile } from '../../actions/user';
import { API, DOMAIN, APP_NAME, FB_APP_ID } from '../../config';
import moment from 'moment';
import ContactForm from './../../components/form/ContactForm';

const UserProfile = ({ user, blogs, query }) => {
	const head = () => (
		<Head>
			<title>
				{user.username} | {APP_NAME}
			</title>
			<meta name="description" content={`Blogs by ${user.username}`} />
			<link rel="canonical" href={`${DOMAIN}/profile/${query.username}`} />
			<meta property="og:title" content={`${user.username}| ${APP_NAME}`} />
			<meta property="og:description" content={`Blogs by ${user.username}`} />
			<meta property="og:type" content="webiste" />
			<meta property="og:url" content={`${DOMAIN}/profile/${query.username}`} />
			<meta property="og:site_name" content={`${APP_NAME}`} />

			<meta property="og:image" content={`${DOMAIN}/public/page.jpg`} />
			<meta property="og:image:secure_url" content={`${DOMAIN}/public/page.jpg`} />
			<meta property="og:image:type" content="image/jpg" />
			<meta property="fb:app_id" content={`${FB_APP_ID}`} />
		</Head>
	);

	const showUserBlogs = () => {
		return blogs.map((blog, index) => {
			return (
				<div className="mt-4 mb-4" key={index}>
					<Link href={`/blogs/${blog.slug}`}>
						<a className="lead text-dark" style={{ textDecoration: 'none' }}>
							{blog.title} <small>- {blog.excerpt}</small>
							<br />
							<small>{moment(user.createdAt).fromNow()} 작성됨</small>
						</a>
					</Link>
				</div>
			);
		});
	};

	return (
		<React.Fragment>
			{head()}
			<Layout>
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<div className="card">
								<div className="card-body">
									<div className="row">
										<div className="col-md-4">
											<img
												src={`${API}/user/photo/${user.username}`}
												className="img img-fluid img-thumbnail mb-3"
												style={{ maxHeight: '450px', maxWidth: '100%' }}
												alt="user profile"
											/>
										</div>
										<div className="col-md-8">
											<h4>{user.name}</h4>
											<p className="text-muted">{user.about}</p>

											<h5 className="card-title bg-info pt-4 pb-4 pl-4 pr-4 text-white mt-4">
												{user.name}님이 최근 작성한 글
											</h5>

											{showUserBlogs()}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<br />

				<div className="container pb-5">
					<div className="row">
						<div className="col-md-12">
							<div className="card">
								<div className="card-body">
									<h5 className="card-title bg-info pt-4 pb-4 pl-4 pr-4 text-light">
										{user.name} 연락처
									</h5>
									<br />
									<ContactForm authorEmail={user.email} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</Layout>
		</React.Fragment>
	);
};

UserProfile.getInitialProps = ({ query }) => {
	return userPublicProfile(query.username)
		.then((data) => {
			if (data.error) console.log(data.error);
			else return { user: data.user, blogs: data.blogs, query };
		})
		.catch((err) => console.log(err));
};

export default UserProfile;

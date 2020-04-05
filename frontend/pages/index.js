// https://codepen.io/htschmed/pen/RMEEzM
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from '../components/Layout';
import Link from 'next/link';
import '../public/home.css';

const Index = () => {
	return (
		<Layout>
			<header className="masthead text-white text-center">
				<div className="container">
					<div className="row">
						<div className="col-xl-9 mx-auto">
							<h1 className="mb-5">
								<b>Sulog</b>에 오신 것을 환영합니다!
							</h1>
						</div>
						<div className="col-md-10 col-lg-8 col-xl-7 mx-auto">
							<div className="form-row">
								<div className="col-12 col-md-6">
									<button className="btn btn-info btn-lg btn-block">
										<Link href="/blogs">
											<a className="link-style">둘러보기</a>
										</Link>
									</button>
								</div>
								<div className="col-12 col-md-6">
									<button className="btn btn-primary btn-lg btn-block">
										<Link href="/signup">
											<a className="link-style">회원가입</a>
										</Link>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>

			<section className="features-icons bg-light text-center">
				<div>
					<h1 className="display-4 pb-5">
						<b>Sulog</b> 기능 소개
						<FontAwesomeIcon icon="tools" style={{ color: '#3B287E' }} />
					</h1>
				</div>
				<div className="container">
					<div className="row">
						<div className="col-lg-4 mb-5">
							<div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
								<div className="features-icons-icon d-flex">
									<i className="icon-screen-desktop m-auto text-primary">
										<FontAwesomeIcon icon="feather" style={{ color: 'F0814D' }} />
									</i>
								</div>
								<h3>블로그 생성</h3>
							</div>
						</div>
						<div className="col-lg-4 mb-5">
							<div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
								<div className="features-icons-icon d-flex">
									<i className="icon-layers m-auto text-primary">
										<FontAwesomeIcon icon="tags" style={{ color: '#58C1B1' }} />
									</i>
								</div>
								<h3>카테고리 생성</h3>
							</div>
						</div>
						<div className="col-lg-4 mb-5">
							<div className="features-icons-item mx-auto mb-0 mb-lg-3">
								<div className="features-icons-icon d-flex">
									<i className="icon-check m-auto text-primary">
										<FontAwesomeIcon icon="tag" style={{ color: '#EE5A66' }} />
									</i>
								</div>
								<h3>태그 생성</h3>
							</div>
						</div>
						<div className="col-lg-4 mb-5">
							<div className="features-icons-item mx-auto mb-0 mb-lg-3">
								<div className="features-icons-icon d-flex">
									<i className="icon-check m-auto text-primary">
										<FontAwesomeIcon icon="network-wired" style={{ color: '#079FB8' }} />
									</i>
								</div>
								<h3>관련 블로그</h3>
							</div>
						</div>
						<div className="col-lg-4 mb-5">
							<div className="features-icons-item mx-auto mb-0 mb-lg-3">
								<div className="features-icons-icon d-flex">
									<i className="icon-check m-auto text-primary">
										<FontAwesomeIcon icon="comments" style={{ color: '#CB3C68' }} />
									</i>
								</div>
								<h3>댓글</h3>
							</div>
						</div>
						<div className="col-lg-4 mb-5">
							<div className="features-icons-item mx-auto mb-0 mb-lg-3">
								<div className="features-icons-icon d-flex">
									<i className="icon-check m-auto text-primary">
										<FontAwesomeIcon icon="thumbs-up" style={{ color: '#6374B8' }} />
									</i>
								</div>
								<h3>좋아요</h3>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="showcase">
				<div className="container-fluid p-0">
					<div className="row no-gutters">
						<div className="col-lg-6 order-lg-2 text-white showcase-img" />
						<div className="col-lg-6 order-lg-1 my-auto showcase-text">
							<h1 className="display-4 pb-5 text-center">
								<b>Sulog</b> 기술 스택
							</h1>
							<p className="lead mb-0">
								Newly improved, and full of great utility classNamees, Bootstrap 4 is leading the way in
								mobile responsive web development! All of the themes on Start Bootstrap are now using
								Bootstrap 4! https://codepen.io/htschmed/pen/RMEEzM
							</p>
						</div>
					</div>
					<div className="row no-gutters">
						<div className="col-lg-6 text-white showcase-img" />
						<div className="col-lg-6 my-auto showcase-text">
							<h2>Updated For Bootstrap 4</h2>
							<p className="lead mb-0">
								Newly improved, and full of great utility classNamees, Bootstrap 4 is leading the way in
								mobile responsive web development! All of the themes on Start Bootstrap are now using
								Bootstrap 4!
							</p>
						</div>
					</div>
					<div className="row no-gutters">
						<div className="col-lg-6 order-lg-2 text-white showcase-img" />
						<div className="col-lg-6 order-lg-1 my-auto showcase-text">
							<h2>Easy to Use &amp; Customize</h2>
							<p className="lead mb-0">
								Landing Page is just HTML and CSS with a splash of SCSS for users who demand some deeper
								customization options. Out of the box, just add your content and images, and your new
								landing page will be ready to go!
							</p>
						</div>
					</div>
				</div>
			</section>

			<footer className="footer bg-light">
				<div className="container">
					<div className="row">
						<div className="col-lg-6 h-100 text-center text-lg-left my-auto">
							<ul className="list-inline mb-2">
								<li className="list-inline-item">
									<a href="#">About</a>
								</li>
								<li className="list-inline-item">&sdot;</li>
								<li className="list-inline-item">
									<a href="#">Contact</a>
								</li>
								<li className="list-inline-item">&sdot;</li>
								<li className="list-inline-item">
									<a href="#">Terms of Use</a>
								</li>
								<li className="list-inline-item">&sdot;</li>
								<li className="list-inline-item">
									<a href="#">Privacy Policy</a>
								</li>
							</ul>
							<p className="text-muted small mb-4 mb-lg-0">
								&copy; Your Website 2020. All Rights Reserved.
							</p>
						</div>
						<div className="col-lg-6 h-100 text-center text-lg-right my-auto">
							<ul className="list-inline mb-0">
								<li className="list-inline-item mr-3">
									<a href="#">
										<i className="fa fa-facebook fa-2x fa-fw" />
									</a>
								</li>
								<li className="list-inline-item mr-3">
									<a href="#">
										<i className="fa fa-twitter fa-2x fa-fw" />
									</a>
								</li>
								<li className="list-inline-item">
									<a href="#">
										<i className="fa fa-instagram fa-2x fa-fw" />
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</footer>
		</Layout>
	);
};

export default Index;

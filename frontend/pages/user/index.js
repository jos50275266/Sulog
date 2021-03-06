import Layout from '../../components/Layout';
import Private from '../../components/auth/Private';
import Link from 'next/link';

const UserIndex = () => {
	return (
		<Layout>
			<Private>
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-12 pt-5 pb-5">
							<h2>사용자 페이지</h2>
						</div>
						<div className="col-md-4">
							<ul className="list-group">
								<li className="list-group-item">
									<a href="/user/crud/blog">블로그 생성</a>
								</li>
								<li className="list-group-item">
									<Link href="/user/crud/blogs">
										<a>블로그 업데이트/삭제</a>
									</Link>
								</li>
								<li className="list-group-item">
									<a href="/user/update">프로필 업데이트</a>
								</li>
							</ul>
						</div>
						<div className="col-md-8">right</div>
					</div>
				</div>
			</Private>
		</Layout>
	);
};

export default UserIndex;

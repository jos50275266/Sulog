import Router from 'next/router';
import GoogleLogin from 'react-google-login';
import { loginWithGoogle, authenticate, isAuth } from '../../actions/auth.js';
import { GOOGLE_CLIENT_ID } from '../../config';

const LoginGoogle = () => {
	const responseGoogle = (response) => {
		const tokenId = response.tokenId;
		const user = { tokenId };

		loginWithGoogle(user)
			.then((data) => {
				if (data.error) {
					console.log(data.error);
				} else {
					authenticate(data, () => {
						if (isAuth() && isAuth().role === 1) {
							Router.push('/');
							// Router.push('/admin');
						} else {
							Router.push('/');
							// Router.push('/user');
						}
					});
				}
			})
			.catch((err) => console.log(err));
	};

	return (
		<div className="pb-3">
			<GoogleLogin
				clientId={`${GOOGLE_CLIENT_ID}`}
				buttonText="Login With Google"
				onSuccess={responseGoogle}
				onFailure={responseGoogle}
				cookiePolicy={'single_host_origin'}
				theme="dark"
			/>
		</div>
	);
};

export default LoginGoogle;

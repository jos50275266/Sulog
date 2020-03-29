import Router from 'next/router';
import { useEffect } from 'react';
import { isAuth } from '../../actions/auth';

// Only For Signin User
const Private = ({ children }) => {
	useEffect(() => {
		if (!isAuth()) Router.push('/signin');
	}, []);

	return <React.Fragment>{children}</React.Fragment>;
};

export default Private;

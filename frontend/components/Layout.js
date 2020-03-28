import Header from './Header';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
	faHeart,
	faKey,
	faFeather,
	faTag,
	faTags,
	faNetworkWired,
	faComments,
	faThumbsUp,
	faTools
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
library.add(faHeart, faKey, faFeather, faTag, faTags, faNetworkWired, faComments, faThumbsUp, faTools);
moment.locale('ko');

const Layout = ({ children }) => {
	return (
		<React.Fragment>
			<Header />
			{children}
		</React.Fragment>
	);
};

export default Layout;

import * as React from 'react';
import ReactDOM from 'react-dom';

const LazyContent = React.lazy(() => import('./components/ContentApp'))

const WithSuspense = () => {
	const [mounted, setMounted] = React.useState(false);

	//on mount
	React.useEffect(() => {
		setTimeout(() => {
			setMounted(true);
		})
	}, []);

	return mounted && <React.Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', width: '500px', boxSizing: 'border-box' }}>Loading...</div>}>
		<LazyContent />
	</React.Suspense>
}

ReactDOM.render(
	<WithSuspense />
	, document.getElementById("root")
);
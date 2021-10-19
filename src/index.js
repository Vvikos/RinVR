import React from 'react';
import ReactDOM from 'react-dom';

import { ARCanvas } from '@react-three/xr';

import BallPit from './BallPit';

import './styles.css';

const App = () => {
	return (
		<ARCanvas
			sessionInit={{ requiredFeatures: ['hit-test'] }}
			pixelRatio={window.devicePixelRatio}>
			<ambientLight />
			<BallPit />
		</ARCanvas>
	);
};

const rootElement = document.getElementById('root');
ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	rootElement,
);

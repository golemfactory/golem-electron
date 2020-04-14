import React from 'react';
import Lottie from 'react-lottie';

import animData from './../../assets/anims/wave.json';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const Wave = ({ stopAnim }) => {
	return (
		<div className="wave-loading" id="waveLoading">
			<Lottie
				width={'100%'}
				options={defaultOptions}
				isStopped={stopAnim}
			/>
		</div>
	);
};

Wave.displayName = 'Wave';

export default Wave;

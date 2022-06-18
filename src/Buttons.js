import React from 'react';
import { useGlobalContext } from './context';

const Buttons = () => {
	const { isLoading, page, nbPages, handlePage } = useGlobalContext();
	return (
		<div className='btn-container'>
			<button
				onClick={() => {
					if (page >= 0) {
						handlePage('Prev-Page');
					} else {
						return;
					}
				}}
				disabled={isLoading}>
				Prev
			</button>
			<p>
				{page +1 }  of {nbPages}
			</p>
			<button onClick={() => handlePage('Next-Page')} disabled={isLoading}>
				Next
			</button>
		</div>
	);
};

export default Buttons;

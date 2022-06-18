import React, { useContext, useEffect, useReducer } from 'react';

import {
	SET_LOADING,
	SET_STORIES,
	REMOVE_STORY,
	HANDLE_PAGE,
	HANDLE_SEARCH,
} from './actions';
import reducer from './reducer';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?';

const initialState = {
	isLoading: true,
	hits: [],
	query: 'react',
	page: 0,
	nbPages: 0,
};

const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
  console.log(state.hits)
	const fetchStories = async (url) => {
		dispatch({ type: SET_LOADING });
		try {
			const response = await fetch(url);
			const data = await response.json();
			dispatch({
				type: SET_STORIES,
				payload: { hits: data.hits, nbPages: data.nbPages },
			});
		} catch (error) {
			console.log(error);
		}
	};

	const removeStory = (id) => {
		const newItems = state.hits.filter((item) => {
			return item.objectID !== id;
		});
		dispatch({ type: REMOVE_STORY, payload: { hits: newItems } });
	};

	const handleSearch = (query) => {
		dispatch({ type: HANDLE_SEARCH, payload: query });
	};

	const handlePage = (value) => {
		if (value === 'Prev-Page') {
			let prevPage = state.page - 1;
			if (prevPage < 0) {
				prevPage = state.nbPages - 1;
			}
			dispatch({ type: HANDLE_PAGE, payload: prevPage });
		}
		if (value === 'Next-Page') {
			let nextPage = state.page + 1;
			if (state.page > state.nbPages - 2) {
				nextPage = 0;
			}
			dispatch({ type: HANDLE_PAGE, payload: nextPage });
		}
	};
	useEffect(() => {
		fetchStories(`${API_ENDPOINT}query=${state.query}&page=${state.page}`);
	}, [state.query, state.page]);

	return (
		<AppContext.Provider
			value={{ ...state, removeStory, handleSearch, handlePage }}>
			{children}
		</AppContext.Provider>
	);
};

export const useGlobalContext = () => {
	return useContext(AppContext);
};

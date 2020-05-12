import React, { useState, useReducer, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import Header from "./components/header";
import Search from "./components/Search";
import Movie from "./components/Movie";

const MOVIE_API_URL = "https://www.omdbapi.com/?s=man&apikey=4a3b711b"

//多个useState 组合，useReducer
const initialState = {
  loading: true,
  movies: [],
  errorMessage: null,
}

const reducer = (state, action) => {
  switch (action.type) {
      case 'SEARCH_MOVIES_REQUEST':
        return {
            ...state,
            loading: true,
            errorMessage: null,
        };
      case 'SEARCH_MOVIES_SUCCESS':
        return {
            ...state,
            loading: false,
            movies: action.payload
        };
      case 'SEARCH_MOVIES_FAILURE':
        return {
            ...state,
            loading: false,
            errorMessage: action.error
        };
      default:
        return state;
  }
}
function App() {
  // const [loading, setLoading] = useState(true);
  // const [movies, setMovies] = useState([]);
  // const [errorMessage, setErrorMessage] = useState(null);

    const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    fetch(MOVIE_API_URL)
        .then(response => response.json())
        .then((jsonResponse) => {
          // setMovies(jsonResponse.Search);
          // setLoading(false)
            dispatch({
                type: 'SEARCH_MOVIES_SUCCESS',
                payload: jsonResponse.Search
            })
        })
  }, []);

  const search = searchValue => {
    // setLoading(true);
    // setErrorMessage(null);

      dispatch({
          type: 'SEARCH_MOVIES_REQUEST'
      })
    fetch(`https://www.omdbapi.com/?s=${searchValue}&apikey=4a3b711b`)
        .then(response => response.json())
        .then(jsonResponse => {
          if (jsonResponse.Response === "True") {
            // setMovies(jsonResponse.Search);
            // setLoading(false);
              dispatch({
                  type: 'SEARCH_MOVIES_SUCCESS',
                  payload: jsonResponse.Search
              })
          }else {
            // setErrorMessage(jsonResponse.Error);
            // setLoading(false);
              dispatch({
                  type: 'SEARCH_MOVIES_FAILURE',
                  error: jsonResponse.Error
              })
          }
        })
  }

  const { movies, errorMessage, loading} = state;
  return (
    <div className="App">
      <Header className="App-header" />
        <Search search={search} />
        <p className="App-intro">Sharing async few of our favourite movies</p>
        <div className="movies">
            {loading && !errorMessage ? (
                <div className="loading">loading...</div>
            ) : errorMessage ? (
                <div className="errorMessage">{errorMessage}</div>
            ) : (
                movies.map((movie, index) => (
                    <Movie key={`${index}-${movie.Title}`} movie={movie}/>
                ))
            )
            }
        </div>
    </div>
  );
}

export default App;

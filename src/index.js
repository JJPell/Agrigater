import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { ApolloProvider as Provider } from "react-apollo";
import config from "./config";
import './styles/index.css';

window.acresInHectare = 2.47105;

const httpLink = createHttpLink({
    uri: config.api + '/graphql',
});


 
const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        Authorisation: token ? token : "",
      }
    }
});
  
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

const AppWrapper = () => (

    <Provider client={client}>
        <App />
    </Provider>

)

ReactDOM.render(<AppWrapper />, document.getElementById('root'));

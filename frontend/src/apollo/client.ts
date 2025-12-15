import {
  ApolloClient,
  InMemoryCache,
} from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: "http://127.0.0.1:8000/graphql/",
});

const authLink = setContext((_, { headers }) => {
  const orgSlug = localStorage.getItem("orgSlug");

  return {
    headers: {
      ...headers,
      ...(orgSlug ? { "X-ORG-SLUG": orgSlug } : {}),
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

import { GraphQLClient } from 'graphql-request';
const gqlURL = 'http://localhost:4000/';
export const gqlCLI = new GraphQLClient(gqlURL);
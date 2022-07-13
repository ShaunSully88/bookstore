const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Query {
    me: User
}
type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(authors: [], description: String!, title: String!, bookId: ID!, image: img!): User
    removeBook(bookId: ID!): User
}
type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
}
type Book {
    bookId: ID
    authors:[String]
    description: String
    title: String
    image: img
    link: link
}
type Auth {
    token: ID!
    user: User
}
`;

module.exports = typeDefs
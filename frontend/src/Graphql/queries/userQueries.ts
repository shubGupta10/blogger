import { gql } from "@apollo/client";

export const GET_AUTHENTICATED_USER = gql`
  query GetAuthenticatedUser {
    authenticatedUser {
      _id
      firstName
      lastName
      email
      profilePicture
      gender
      blogs {
        _id
        title
      }
    }
  }
`;

export const GET_SINGLEUSER = gql`
  query GetUser($userId: ID!) {
    user(userId: $userId) {
      _id
      firstName
      lastName
      email
      profilePicture
      gender
      blogs {
        _id
        title
        blogImage
        blogContent
        createdAt
      }
    }
  }
`;
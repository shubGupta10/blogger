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
      recommendedCategory
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


export const FETCH_USER_BY_ID = gql`
  query FetchUserByID($userId: ID!) {
    fetchUserByID(userId: $userId) {
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

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
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

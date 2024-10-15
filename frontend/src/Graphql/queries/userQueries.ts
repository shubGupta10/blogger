import {gql} from "@apollo/client";

export const GET_AUTHENTICATED_USER = gql`
  query GetAuthenticatedUser {
    authenticatedUser {
        _id
        firstName
        lastName
        email
        profilePicture
        gender
    }
  }
`


export const GET_SINGLEUSER = gql`
  query GetUser($userId: ID!) {
    user(userId: $userId){
        _id
        firstName
        lastName
        email
        profilePicture
        gender
    }
  }
`
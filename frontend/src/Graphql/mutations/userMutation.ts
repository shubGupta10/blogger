import { gql } from "@apollo/client";

export const SIGNUP = gql`
 mutation SignUp($input: SignUpInput!){
    signUp(input: $input){
        user{
         _id
         firstName
         lastName
         email
         profilePicture
         gender
        }
        token
    }
 }
`


export const LOGIN = gql`
 mutation Login($input: LoginInput!){
   login(input: $input){
      user {
      _id
      firstName
      lastName
      email
      profilePicture
      gender
    }
    token
  }
   }
`


export const LOGOUT = gql`
  mutation Logout{
   logout{
      message
   }
  }
`


export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      firstName
      lastName
      email
      gender
    }
  }
`;




export const DELETE_USER = gql`
  mutation DeleteUser($password: String!) {
    deleteUser(password: $password) {
      message
    }
  }
`;



export const ADD_CATEGORIES_TO_USER = gql`
  mutation AddCategoriesToUser($categories: [String!]!) {
    addCategoriesToUser(categories: $categories) {
      _id
      recommendedCategory
    }
  }
`;

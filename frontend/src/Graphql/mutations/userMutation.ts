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
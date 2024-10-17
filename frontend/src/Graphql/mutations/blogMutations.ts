import { gql } from "@apollo/client";

export const CREATEBLOG = gql`
  mutation CreateBlog($input: createBlogInput!) {
    createBlog(input: $input) {
      _id
      title
      blogImage
      blogContent
      createdAt
      user {
        _id
        firstName
        lastName
      }
    }
  }
`;

export const UPDATEBLOG = gql`
  mutation UpdateBlog($input: updateBlogInput!) {
    updateBlog(input: $input) {
      _id
      title
      blogImage
      blogContent
      createdAt
      user {
        _id
        firstName
        lastName
      }
    }
  }
`;

export const DELETEBLOG = gql`
  mutation DeleteBlog($blogId: ID!) {
    deleteBlog(blogId: $blogId) {
      _id
      title
    }
  }
`;


export const GENERATE_STORY = gql`
  mutation GenerateStory($prompt: String!){
    generateStory(prompt: $prompt)
  }
`
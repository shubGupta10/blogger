import { gql } from "@apollo/client";

export const CREATEBLOG = gql`
  mutation CreateBlog($input: createBlogInput!) {
    createBlog(input: $input) {
      _id
      title
      blogImage
      blogContent
      blogCategory
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
`;


export const LIKE_BLOG = gql`
  mutation LikeBlog($blogId: ID!) {
    likeBlog(blogId: $blogId) {
      _id
      title
      blogContent
      likeCount
      likedBy {
        _id
        firstName
        lastName
      }
    }
  }
`;

export const UNLIKE_BLOG = gql`
  mutation UnlikeBlog($blogId: ID!) {
    unlikeBlog(blogId: $blogId) {
      _id
      title
      blogContent
      likeCount
      likedBy {
        _id
        firstName
        lastName
      }
    }
  }
`;
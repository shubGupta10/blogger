import { gql } from "@apollo/client";

export const GET_BLOGS = gql`
  query GetBlogs {
    blogs {
      _id
      title
      blogImage
      blogContent
      createdAt
    }
  }
`;

export const GET_SINGLEBLOG = gql`
  query GetBlog($blogId: ID!) {
    blog(blogId: $blogId) {
      _id
      title
      blogImage
      blogContent
      createdAt
    }
  }
`;

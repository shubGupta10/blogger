import { gql } from "@apollo/client";

export const GET_BLOGS = gql`
  query GetBlogs {
    blogs {
      _id
      title
      blogImage
      blogContent
      blogCategory
      createdAt
      likeCount
      user {
        _id
        firstName
        lastName
      }
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
      blogCategory
      createdAt
      likeCount
      likedBy {
        _id
      }
      user {
        _id
        firstName
        lastName
        email
        profilePicture
      }
    }
  }
`;


export const GET_BLOGS_BY_USER = gql`
 query GetBlogsByUser {
    blogsByUser {
        _id
        title
        blogImage
        blogContent
        blogCategory
        createdAt
    }
}
`;

export const GET_BLOGS_BY_CATEGORY = gql`
  query blogsByCategory($blogCategory: String!) {
    blogsByCategory(blogCategory: $blogCategory) {
      _id
      title
      blogImage
      blogContent
      blogCategory
      likeCount
      user {
        _id
        firstName
        lastName
      }
    }
  }
`;


export const GET_BLOGS_BY_CATEGORIES = gql`
  query blogsByCategories($blogCategories: [String!]!) {
    blogsByCategories(blogCategories: $blogCategories) {
      _id
      title
      blogImage
      blogContent
      blogCategory
      likeCount
      user {
        _id
        firstName
        lastName
      }
    }
  }
`;

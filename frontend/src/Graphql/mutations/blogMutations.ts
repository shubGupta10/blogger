import { gql } from "@apollo/client";

export const CREATEBLOG = gql`
  mutation CreateBlog($input: createBlogInput!) {
    createBlog(input: $input) {
      _id
      title
      blogImage
      blogContent
      createdAt
      userId
    }
  }
`

export const UPDATEBLOG = gql`
  mutation UpdateBlog($input: updateBlogInput!) {
    updateBlog(input: $input) {
      _id
      title
      blogImage
      blogContent
      createdAt
      userId
    }
  }
`


export const DELETEBLOG = gql`
  mutation DeleteBlog($blogId: ID!) {
    deleteBlog(blogId: $blogId) {
      _id
      title
      blogImage
      blogContent
      createdAt
      userId
    }
  }
`
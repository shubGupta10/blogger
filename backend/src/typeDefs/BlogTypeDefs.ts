const blogTypeDefs = `#graphql
 type Blog {
    _id: ID!
    title: String!
    blogImage: String!
    blogContent: String! 
    createdAt: String!
    userId: String!
    user: User!
 }

 type Query {
    blogs: [Blog!]!
    blog(blogId: ID!): Blog
    blogsByUser: [Blog]
 }

 type Mutation {
    createBlog(input: createBlogInput!): Blog!
    updateBlog(input: updateBlogInput!): Blog!
    deleteBlog(blogId: ID!): Blog!
 }

 input createBlogInput {
    title: String!
    blogImage: String!
    blogContent: String! 
 }

 input updateBlogInput {  
    blogId: ID!
    title: String!
    blogImage: String!
    blogContent: String!  
 }
`

export default blogTypeDefs;

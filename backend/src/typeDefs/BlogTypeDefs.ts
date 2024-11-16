const blogTypeDefs = `#graphql
 type Blog {
    _id: ID!
    title: String!
    blogImage: String!
    blogContent: String!
    blogCategory: String! 
    likeCount: Int!
    likedBy: [User!]!
    createdAt: String!
    userId: String!
    user: User!
 }

 type Query {
    blogs: [Blog!]!
    blog(blogId: ID!): Blog
    blogsByUser: [Blog]
    blogsByCategory(blogCategory: String!): [Blog] 
    blogsByCategories(blogCategories: [String!]!): [Blog]
 }

 type Mutation {
    createBlog(input: createBlogInput!): Blog!
    updateBlog(input: updateBlogInput!): Blog!
    deleteBlog(blogId: ID!): Blog!
    generateStory(prompt: String!): String
    likeBlog(blogId: ID!): Blog!
    unlikeBlog(blogId: ID!): Blog!
 }

 input createBlogInput {
    title: String!
    blogImage: String!
    blogContent: String! 
    blogCategory: String!
 }

 input updateBlogInput {  
    blogId: ID!
    title: String!
    blogImage: String!
    blogContent: String!  
 }
`

export default blogTypeDefs;

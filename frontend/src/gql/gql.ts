/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n  mutation CreateBlog($input: createBlogInput!) {\n    createBlog(input: $input) {\n      _id\n      title\n      blogImage\n      blogContent\n      blogCategory\n      createdAt\n      user {\n        _id\n        firstName\n        lastName\n      }\n    }\n  }\n": types.CreateBlogDocument,
    "\n  mutation UpdateBlog($input: updateBlogInput!) {\n    updateBlog(input: $input) {\n      _id\n      title\n      blogImage\n      blogContent\n      createdAt\n      user {\n        _id\n        firstName\n        lastName\n      }\n    }\n  }\n": types.UpdateBlogDocument,
    "\n  mutation DeleteBlog($blogId: ID!) {\n    deleteBlog(blogId: $blogId) {\n      _id\n      title\n    }\n  }\n": types.DeleteBlogDocument,
    "\n  mutation GenerateStory($prompt: String!){\n    generateStory(prompt: $prompt)\n  }\n": types.GenerateStoryDocument,
    "\n mutation SignUp($input: SignUpInput!){\n    signUp(input: $input){\n        user{\n         _id\n         firstName\n         lastName\n         email\n         profilePicture\n         gender\n        }\n        token\n    }\n }\n": types.SignUpDocument,
    "\n mutation Login($input: LoginInput!){\n   login(input: $input){\n      user {\n      _id\n      firstName\n      lastName\n      email\n      profilePicture\n      gender\n    }\n    token\n  }\n   }\n": types.LoginDocument,
    "\n  mutation Logout{\n   logout{\n      message\n   }\n  }\n": types.LogoutDocument,
    "\n  query GetBlogs {\n    blogs {\n      _id\n      title\n      blogImage\n      blogContent\n      blogCategory\n      createdAt\n      user {\n        _id\n        firstName\n        lastName\n      }\n    }\n  }\n": types.GetBlogsDocument,
    "\n  query GetBlog($blogId: ID!) {\n    blog(blogId: $blogId) {\n      _id\n      title\n      blogImage\n      blogContent\n      blogCategory\n      createdAt\n      user {\n        _id\n        firstName\n        lastName\n        email\n        profilePicture\n      }\n    }\n  }\n": types.GetBlogDocument,
    "\n query GetBlogsByUser {\n    blogsByUser {\n        _id\n        title\n        blogImage\n        blogContent\n        blogCategory\n        createdAt\n    }\n}\n": types.GetBlogsByUserDocument,
    "\n  query blogsByCategory($blogCategory: String!) {\n    blogsByCategory(blogCategory: $blogCategory) {\n      _id\n      title\n      blogImage\n      blogContent\n      blogCategory\n      user {\n        _id\n        firstName\n        lastName\n      }\n    }\n  }\n": types.BlogsByCategoryDocument,
    "\n  query GetAuthenticatedUser {\n    authenticatedUser {\n      _id\n      firstName\n      lastName\n      email\n      profilePicture\n      gender\n      blogs {\n        _id\n        title\n      }\n    }\n  }\n": types.GetAuthenticatedUserDocument,
    "\n  query GetUser($userId: ID!) {\n    user(userId: $userId) {\n      _id\n      firstName\n      lastName\n      email\n      profilePicture\n      gender\n      blogs {\n        _id\n        title\n        blogImage\n        blogContent\n        createdAt\n      }\n    }\n  }\n": types.GetUserDocument,
    "\n  query FetchUserByID($userId: ID!) {\n    fetchUserByID(userId: $userId) {\n      _id\n      firstName\n      lastName\n      email\n      profilePicture\n      gender\n      blogs {\n        _id\n        title\n        blogImage\n        blogContent\n        createdAt\n      }\n    }\n  }\n": types.FetchUserByIdDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateBlog($input: createBlogInput!) {\n    createBlog(input: $input) {\n      _id\n      title\n      blogImage\n      blogContent\n      blogCategory\n      createdAt\n      user {\n        _id\n        firstName\n        lastName\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateBlog($input: createBlogInput!) {\n    createBlog(input: $input) {\n      _id\n      title\n      blogImage\n      blogContent\n      blogCategory\n      createdAt\n      user {\n        _id\n        firstName\n        lastName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateBlog($input: updateBlogInput!) {\n    updateBlog(input: $input) {\n      _id\n      title\n      blogImage\n      blogContent\n      createdAt\n      user {\n        _id\n        firstName\n        lastName\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateBlog($input: updateBlogInput!) {\n    updateBlog(input: $input) {\n      _id\n      title\n      blogImage\n      blogContent\n      createdAt\n      user {\n        _id\n        firstName\n        lastName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteBlog($blogId: ID!) {\n    deleteBlog(blogId: $blogId) {\n      _id\n      title\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteBlog($blogId: ID!) {\n    deleteBlog(blogId: $blogId) {\n      _id\n      title\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation GenerateStory($prompt: String!){\n    generateStory(prompt: $prompt)\n  }\n"): (typeof documents)["\n  mutation GenerateStory($prompt: String!){\n    generateStory(prompt: $prompt)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n mutation SignUp($input: SignUpInput!){\n    signUp(input: $input){\n        user{\n         _id\n         firstName\n         lastName\n         email\n         profilePicture\n         gender\n        }\n        token\n    }\n }\n"): (typeof documents)["\n mutation SignUp($input: SignUpInput!){\n    signUp(input: $input){\n        user{\n         _id\n         firstName\n         lastName\n         email\n         profilePicture\n         gender\n        }\n        token\n    }\n }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n mutation Login($input: LoginInput!){\n   login(input: $input){\n      user {\n      _id\n      firstName\n      lastName\n      email\n      profilePicture\n      gender\n    }\n    token\n  }\n   }\n"): (typeof documents)["\n mutation Login($input: LoginInput!){\n   login(input: $input){\n      user {\n      _id\n      firstName\n      lastName\n      email\n      profilePicture\n      gender\n    }\n    token\n  }\n   }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Logout{\n   logout{\n      message\n   }\n  }\n"): (typeof documents)["\n  mutation Logout{\n   logout{\n      message\n   }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetBlogs {\n    blogs {\n      _id\n      title\n      blogImage\n      blogContent\n      blogCategory\n      createdAt\n      user {\n        _id\n        firstName\n        lastName\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetBlogs {\n    blogs {\n      _id\n      title\n      blogImage\n      blogContent\n      blogCategory\n      createdAt\n      user {\n        _id\n        firstName\n        lastName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetBlog($blogId: ID!) {\n    blog(blogId: $blogId) {\n      _id\n      title\n      blogImage\n      blogContent\n      blogCategory\n      createdAt\n      user {\n        _id\n        firstName\n        lastName\n        email\n        profilePicture\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetBlog($blogId: ID!) {\n    blog(blogId: $blogId) {\n      _id\n      title\n      blogImage\n      blogContent\n      blogCategory\n      createdAt\n      user {\n        _id\n        firstName\n        lastName\n        email\n        profilePicture\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n query GetBlogsByUser {\n    blogsByUser {\n        _id\n        title\n        blogImage\n        blogContent\n        blogCategory\n        createdAt\n    }\n}\n"): (typeof documents)["\n query GetBlogsByUser {\n    blogsByUser {\n        _id\n        title\n        blogImage\n        blogContent\n        blogCategory\n        createdAt\n    }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query blogsByCategory($blogCategory: String!) {\n    blogsByCategory(blogCategory: $blogCategory) {\n      _id\n      title\n      blogImage\n      blogContent\n      blogCategory\n      user {\n        _id\n        firstName\n        lastName\n      }\n    }\n  }\n"): (typeof documents)["\n  query blogsByCategory($blogCategory: String!) {\n    blogsByCategory(blogCategory: $blogCategory) {\n      _id\n      title\n      blogImage\n      blogContent\n      blogCategory\n      user {\n        _id\n        firstName\n        lastName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAuthenticatedUser {\n    authenticatedUser {\n      _id\n      firstName\n      lastName\n      email\n      profilePicture\n      gender\n      blogs {\n        _id\n        title\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAuthenticatedUser {\n    authenticatedUser {\n      _id\n      firstName\n      lastName\n      email\n      profilePicture\n      gender\n      blogs {\n        _id\n        title\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUser($userId: ID!) {\n    user(userId: $userId) {\n      _id\n      firstName\n      lastName\n      email\n      profilePicture\n      gender\n      blogs {\n        _id\n        title\n        blogImage\n        blogContent\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUser($userId: ID!) {\n    user(userId: $userId) {\n      _id\n      firstName\n      lastName\n      email\n      profilePicture\n      gender\n      blogs {\n        _id\n        title\n        blogImage\n        blogContent\n        createdAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FetchUserByID($userId: ID!) {\n    fetchUserByID(userId: $userId) {\n      _id\n      firstName\n      lastName\n      email\n      profilePicture\n      gender\n      blogs {\n        _id\n        title\n        blogImage\n        blogContent\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query FetchUserByID($userId: ID!) {\n    fetchUserByID(userId: $userId) {\n      _id\n      firstName\n      lastName\n      email\n      profilePicture\n      gender\n      blogs {\n        _id\n        title\n        blogImage\n        blogContent\n        createdAt\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
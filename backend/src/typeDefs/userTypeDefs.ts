const userTypeDefs = `#graphql
  #type define for user
  #Step1: Define types for user, its like api structure
  type User{
    _id: ID!
    firstName: String!
    lastName: String
    email: String!
    password: String!
    profilePicture: String!
    gender: String!
    blogs: [Blog!]
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  #Step 2: what query will u perform, (getting data)
  type Query{
    users: [User!]
    authenticatedUser: User
    user(userId: ID!): User
  }

  #Step 3: what mutuation will u perfrom, like (manipulation data)
  type Mutation {
    signUp(input: SignUpInput): AuthPayload
    login(input: LoginInput): AuthPayload
    logout: LogoutResponse
  }

  #Step4: Mutation waale inputs define kro
  input SignUpInput{
    firstName: String!
    lastName: String
    email: String!
    password: String!
    gender: String
  }


  input LoginInput{
    email: String!
    password: String!
  }

  type LogoutResponse{
    message: String!
  }
`


export default userTypeDefs
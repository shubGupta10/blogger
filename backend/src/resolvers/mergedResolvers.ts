import {mergeResolvers} from '@graphql-tools/merge'
import blogResolver from './blogResolvers.js'
import userResolver from './userResolvers.js'

const mergedResolvers = mergeResolvers([blogResolver, userResolver]);

export default mergedResolvers
import {mergeTypeDefs} from '@graphql-tools/merge'
import userTypeDefs from './userTypeDefs.js'
import blogTypeDefs from './BlogTypeDefs.js'

const mergedTypeDefs = mergeTypeDefs([userTypeDefs, blogTypeDefs])

export default mergedTypeDefs
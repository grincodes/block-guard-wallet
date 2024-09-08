import { Posts } from "../../../modules/posts/infra/entity/PostEntity.model"
import { Users } from "../../../modules/users/infra/entity/UserEntity.model"

export interface UpdateResponse {
  id: string
  status: boolean
}

export interface CreateResponse {
  id: string
  status?: string
}

export  interface LatestPosts {
   id:string,
   firstName:string
   title:string
   createdAt:string
}
export interface UsersPaginatedResponse {
  users: Users[]
  pagination: {
    total: number
    pageSize: number
    currentPage: number
  }
}

export interface UserPostsPaginatedResponse {
  posts: Posts[]
  pagination: {
    total: number
    pageSize: number
    currentPage: number
  }
}
export const maxHashedLength = 60

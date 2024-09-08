import * as typeorm from "typeorm"
import * as dotenv from "dotenv"
import { Config } from "../../../config"
import { Users } from "../../../modules/users/infra/entity/UserEntity.model"
import { Posts } from "../../../modules/posts/infra/entity/PostEntity.model"
import { Comments } from "../../../modules/comments/infra/entity/CommentEntity.model"

dotenv.config()

export default new typeorm.DataSource({
  type: "postgres",
  host: Config.DATABASE_HOST,
  port: Config.DATABASE_PORT,
  database: Config.DATABASE_NAME,
  username: Config.DATABASE_USER,
  password: Config.DATABASE_PASSWORD,
  synchronize: Config.DATABASE_SYNC,
  // "src/lib/infra/db/migrations/*{.ts,.js}"
  entities: [Users,Posts,Comments],
  migrations: ["src/lib/infra/db/migrations/*{.ts,.js}"],
  extra: {
    trustServerCertificate: true,
  },
})

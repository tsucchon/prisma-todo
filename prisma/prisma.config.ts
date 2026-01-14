import { defineConfig } from '@prisma/client'

export default {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
}

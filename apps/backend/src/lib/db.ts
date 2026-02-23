import { PrismaClient } from "@packages/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@packages/env";

const connectionString = `${env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };

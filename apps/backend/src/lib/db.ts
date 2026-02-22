import { PrismaClient } from "@package/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@package/env";

const connectionString = `${env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };

import { prisma } from "@/lib/prisma";

// Get all users
export async function getUsers() {
  return prisma.user.findMany();
}

// Get a single user by email
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

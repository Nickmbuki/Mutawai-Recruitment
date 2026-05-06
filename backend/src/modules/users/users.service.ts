import { eq } from "drizzle-orm";
import { db } from "../../db/client.js";
import { users } from "../../db/schema.js";
import { AppError } from "../../utils/app-error.js";
import { serializeUser } from "../auth/auth.service.js";

export async function getUserById(id: number) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return serializeUser(user);
}

import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";
import { cache } from "react";

// Wrapping in cache() prevents duplicate database queries during a single server render
export const checkUser = cache(async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    // Safely construct the name in case firstName or lastName is missing from Clerk
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name: name || "User", // Fallback if name is entirely empty
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newUser;
  } catch (error) {
    console.error(error.message);
    // Returning null on error ensures the app doesn't crash completely if the DB is temporarily unreachable
    return null;
  }
});
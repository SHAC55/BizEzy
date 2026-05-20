import { afterAll, beforeEach, describe, expect, it } from "bun:test";
import { prisma } from "../config/db";
import { deleteAccount } from "../services/auth.service";
import { resetDatabase, seedUserWithBusiness } from "./factories";

beforeEach(resetDatabase);
afterAll(async () => {
  await prisma.$disconnect();
});

const seedSessionAndCode = async (userId: number) => {
  await prisma.session.create({
    data: {
      userId,
      userAgent: "test-agent",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    },
  });
  await prisma.verificationCode.create({
    data: {
      userId,
      type: "EMAIL_VERIFICATION",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    },
  });
};

describe("deleteAccount — anonymization & session revocation", () => {
  it("rejects deletion when the password is wrong — nothing changes", async () => {
    const { user } = await seedUserWithBusiness();
    await seedSessionAndCode(user.id);

    await expect(deleteAccount(user.id, "WrongPassword!")).rejects.toThrow();

    const after = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(after.archivedAt).toBeNull();
    expect(after.email).not.toBeNull();

    const sessions = await prisma.session.findMany({ where: { userId: user.id } });
    expect(sessions).toHaveLength(1);
  });

  it("with the correct password, sets archivedAt and anonymizes the user row", async () => {
    const { user, plainPassword } = await seedUserWithBusiness();
    const originalEmail = user.email;

    const { archivedAt } = await deleteAccount(user.id, plainPassword);

    const after = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(after.archivedAt).not.toBeNull();
    expect(after.archivedAt?.getTime()).toBe(archivedAt.getTime());
    expect(after.email).toBeNull();
    expect(after.mobile).toBeNull();
    expect(after.password).toBeNull();
    expect(after.provider).toBeNull();
    // name is replaced with an anon placeholder, not the original
    expect(after.name).not.toBe("Test User");
    expect(after.name).toMatch(/^deleted-/);
    expect(after.email).not.toBe(originalEmail);
  });

  it("deletes every session belonging to the user", async () => {
    const { user, plainPassword } = await seedUserWithBusiness();
    await seedSessionAndCode(user.id);
    await seedSessionAndCode(user.id);
    await seedSessionAndCode(user.id);

    const before = await prisma.session.count({ where: { userId: user.id } });
    expect(before).toBe(3);

    await deleteAccount(user.id, plainPassword);

    const after = await prisma.session.count({ where: { userId: user.id } });
    expect(after).toBe(0);
  });

  it("deletes every outstanding verification code", async () => {
    const { user, plainPassword } = await seedUserWithBusiness();
    await seedSessionAndCode(user.id);
    await seedSessionAndCode(user.id);

    const before = await prisma.verificationCode.count({ where: { userId: user.id } });
    expect(before).toBe(2);

    await deleteAccount(user.id, plainPassword);

    const after = await prisma.verificationCode.count({ where: { userId: user.id } });
    expect(after).toBe(0);
  });

  it("preserves the user row and the business so historical sales stay attributable", async () => {
    const { user, business, plainPassword } = await seedUserWithBusiness();
    await deleteAccount(user.id, plainPassword);

    // User still exists (just anonymized), business still exists
    const u = await prisma.user.findUnique({ where: { id: user.id } });
    expect(u).not.toBeNull();
    const b = await prisma.business.findUnique({ where: { id: business.id } });
    expect(b).not.toBeNull();
  });

  it("refuses to delete an already-deleted account", async () => {
    const { user, plainPassword } = await seedUserWithBusiness();
    await deleteAccount(user.id, plainPassword);

    await expect(deleteAccount(user.id, plainPassword)).rejects.toThrow();
  });

  it("frees the email so it can be reused by a fresh signup after deletion", async () => {
    const targetEmail = "reusable@test.local";
    const { user, plainPassword } = await seedUserWithBusiness({ email: targetEmail });
    await deleteAccount(user.id, plainPassword);

    // The email column on the unique index should now be NULL → a new user with
    // the same email must be insertable.
    const reborn = await prisma.user.create({
      data: { email: targetEmail, password: "x", name: "Reborn", verified: true },
    });
    expect(reborn.email).toBe(targetEmail);
    expect(reborn.id).not.toBe(user.id);
  });
});

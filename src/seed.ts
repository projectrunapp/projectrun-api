
import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";
import * as process from "process";

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn'],
    datasources: {
        db: {
            url: process.env.DB_URL
        }
    }
});

async function connect() {
    try {
        await prisma.$connect();
        console.log("Database connection is working.");
    } catch (err) {
        console.log(err);
    } finally {
        await prisma.$disconnect();
    }
}

async function createUsers(): Promise<any> {
    const prisma = new PrismaClient();
    const hashedPassword = await argon2.hash('password');
    await prisma.user.createMany({
        data: [
            {
                name: "User 1", username: "user1", email: "user1@gmail.com", hash: hashedPassword,
                birth_date: "1990-01-01", gender: "unknown",
            },
            {
                name: "User 2", username: "user2", email: "user2@gmail.com", hash: hashedPassword,
                birth_date: "1990-01-01", gender: "unknown",
            },
            {
                name: "User 3", username: "user3", email: "user3@gmail.com", hash: hashedPassword,
                birth_date: "1990-01-01", gender: "unknown",
            },
            {
                name: "User 4", username: "user4", email: "user4@gmail.com", hash: hashedPassword,
                birth_date: "1990-01-01", gender: "unknown",
            },
            {
                name: "User 5", username: "user5", email: "user5@gmail.com", hash: hashedPassword,
                birth_date: "1990-01-01", gender: "unknown",
            },
            {
                name: "User 6", username: "user6", email: "user6@gmail.com", hash: hashedPassword,
                birth_date: "1990-01-01", gender: "unknown",
            },
        ],
        skipDuplicates: true,
    });
}

async function createFriendships(): Promise<any> {
    const prisma = new PrismaClient();

    const user1 = await prisma.user.findUnique({where: {email: "user1@gmail.com"}, select: {id: true}});
    const user2 = await prisma.user.findUnique({where: {email: "user2@gmail.com"}, select: {id: true}});
    const user3 = await prisma.user.findUnique({where: {email: "user3@gmail.com"}, select: {id: true}});
    const user4 = await prisma.user.findUnique({where: {email: "user4@gmail.com"}, select: {id: true}});
    const user5 = await prisma.user.findUnique({where: {email: "user5@gmail.com"}, select: {id: true}});
    const user6 = await prisma.user.findUnique({where: {email: "user6@gmail.com"}, select: {id: true}});

    await prisma.friendship.createMany({
        data: [
            {status: "ACCEPTED", senderId: user2.id, receiverId: user1.id},
            {status: "PENDING", senderId: user3.id, receiverId: user1.id},
            {status: "ACCEPTED", senderId: user4.id, receiverId: user1.id},
            {status: "ACCEPTED", senderId: user5.id, receiverId: user1.id},
            {status: "PENDING", senderId: user2.id, receiverId: user3.id},
            {status: "PENDING", senderId: user2.id, receiverId: user4.id},
            {status: "ACCEPTED", senderId: user3.id, receiverId: user4.id},
        ],
        skipDuplicates: true,
    });
}

connect().then(async () => {
    await createUsers();
    await createFriendships();

    console.log('\x1b[32m%s\x1b[0m:', "Seeding completed successfully!");
    process.exit(0);
}).catch(err => {
    console.log(err);
    process.exit(1);
});

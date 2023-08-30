
import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";
import * as process from "process";
import { faker } from '@faker-js/faker';

// fake data
const usersCount = 100;
const minRunsCountPerUser = 0;
const maxRunsCountPerUser = 100;
const userShortestRunInMinutes = 1;
const userLongestRunInMinutes = 300;
const userMinBirthYear = 1960;
const userMaxBirthYear = 2010;

async function connect() {
    const prismaClient = new PrismaClient({
        // log: ['query', 'info', 'warn'],
        datasources: {
            db: {
                url: process.env.DB_URL
            }
        }
    });

    try {
        await prismaClient.$connect();
        console.log('\x1b[32m%s\x1b[0m:', "Database connection is working");

        return prismaClient;
    } catch (err) {
        console.log(err);
    } finally {
        await prismaClient.$disconnect();
    }
}

async function createUsers(prismaClient: PrismaClient): Promise<any> {
    const hashedPassword = await argon2.hash('password');
    const users = [];
    for (let i = 0; i < usersCount; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const username = faker.internet.userName({firstName, lastName});
        const emailParts = faker.internet.email({firstName, lastName}).split('@');
        const emailLocalPart = emailParts[0].replace(/[^a-zA-Z0-9.]/g, '');
        const email = emailLocalPart.toLowerCase() + '@' + emailParts[1];

        users.push({
            hash: hashedPassword,
            name: `${firstName} ${lastName}`,
            email,
            username,
            birth_date: faker.date.birthdate({
                mode: 'year',
                min: userMinBirthYear,
                max: userMaxBirthYear,
            }).toISOString().substring(0, 10),
            gender: faker.helpers.arrayElement(['unknown', 'male', 'female', 'other']),
        });
    }

    await prismaClient.user.createMany({
        data: users,
        skipDuplicates: true,
    });

    console.log('\x1b[32m%s\x1b[0m:', `Added ${usersCount} users in total`)
}

async function createFriendships(prismaClient: PrismaClient): Promise<any> {
    enum EnumRelationshipStatus {
        PENDING = "PENDING",
        ACCEPTED = "ACCEPTED",
        DECLINED = "DECLINED" // TODO: review this functionality
    }
    const friendships: {
        status: EnumRelationshipStatus,
        senderId: number,
        receiverId: number,
    }[] = [];

    let pendingFriendshipsCount = 0;
    let acceptedFriendshipsCount = 0;
    for (let senderId = 1; senderId < usersCount; senderId++) {
        for (let receiverId = senderId + 1; receiverId <= usersCount; receiverId++) {
            if (faker.datatype.boolean(0.3)) {
                const friendshipStatus = faker.helpers.arrayElement([
                    EnumRelationshipStatus.PENDING,
                    EnumRelationshipStatus.ACCEPTED,
                ]);
                if (friendshipStatus === EnumRelationshipStatus.PENDING) {
                    pendingFriendshipsCount++;
                }
                if (friendshipStatus === EnumRelationshipStatus.ACCEPTED) {
                    acceptedFriendshipsCount++;
                }

                friendships.push({
                    senderId, receiverId,
                    status: friendshipStatus,
                });
            }
        }
    }

    await prismaClient.friendship.createMany({
        data: friendships,
        skipDuplicates: true,
    });

    console.log('\x1b[32m%s\x1b[0m:', `Added ${pendingFriendshipsCount} pending and ${acceptedFriendshipsCount} accepted fake friendships (${friendships.length} in total)`);
}

async function createRuns(prismaClient: PrismaClient): Promise<any> {
    // Google Maps coordinates
    const coordinatesRectangle = {
        topLeft: {lat: 44.662052, lng: -114.447634},
        topRight: {lat: 44.270990, lng: -89.847386},
        bottomLeft: {lat: 35.030414, lng: -115.735263},
        bottomRight: {lat: 34.999016, lng: -91.073858},
    };

    let fakeRunsCount = 0;
    for (let userId = 1; userId <= usersCount; userId++)
    {
        const userRunsCount = faker.number.int({min: minRunsCountPerUser, max: maxRunsCountPerUser});
        fakeRunsCount += userRunsCount;
        const userRuns = [];

        const toDate = new Date();
        const fromDate = new Date(toDate.setDate(toDate.getDate() - userRunsCount));
        const runningDates = faker.date.betweens({
            from: fromDate,
            to: toDate,
            count: userRunsCount,
        });

        for (let i = 0; i < userRunsCount; i++) {
            const runSeconds = faker.number.int({
                min: userRunsCount > 10 ? 10 * userShortestRunInMinutes * 60 : userShortestRunInMinutes * 60,
                max: userLongestRunInMinutes * 60 * 60
            }); // 1|10 minutes to 5 hours
            const datetimeStart = runningDates[i];

            const runMinutes = Math.floor(runSeconds / 60);
            const datetimeEnd = new Date(datetimeStart.getTime() + runSeconds * 1000);
            const averageSpeed = faker.number.int({
                min: 100,
                max: 150 - (runMinutes > 60 ? 20 : 0)
            }); // meters per minute
            const distance = runMinutes * averageSpeed;
            const elevationGain = faker.number.int({
                min: -1 * distance / 100,
                max: distance / 100
            }); // meters

            const dateHour = runningDates[i].getHours();
            let title = "";
            if (dateHour >= 6 && dateHour < 12) {
                title = "Morning Run";
            } else if (dateHour >= 12 && dateHour < 18) {
                title = "Afternoon Run";
            } else if (dateHour >= 18 && dateHour < 24) {
                title = "Evening Run";
            } else {
                title = "Night Run";
            }

            const coordinatesPair = generateCoordinates(coordinatesRectangle);

            userRuns.push({
                userId,
                title: title,
                calories_burned: Math.floor(runMinutes * 11.4), // ~11.4 calories per minute
                datetime_start: datetimeStart,
                datetime_end: datetimeEnd,
                distance: distance, // ~120 meters per minute
                duration: runSeconds,
                elevation_gain: elevationGain,
                // heart_rate_avg: null,
                location_start: `${coordinatesPair.start.lat},${coordinatesPair.start.lng}`,
                location_end: `${coordinatesPair.end.lat},${coordinatesPair.end.lng}`,
                notes: faker.lorem.sentence(),
                pace_avg: Math.floor(averageSpeed / 60), // minutes per kilometer
                temperature: faker.number.int({min: 10, max: 30}),
                // TODO: set all the Enums on prisma schema
                terrain: faker.helpers.arrayElement(['unknown', 'road', 'trail', 'track']),
                weather: faker.helpers.arrayElement(['unknown', 'sunny', 'cloudy', 'rainy', 'snowy', 'windy']),
            });
        }

        await prismaClient.run.createMany({
            data: userRuns,
            skipDuplicates: true,
        });

        // console.log('\x1b[32m%s\x1b[0m:', `Added ${userRunsCount} runs for user with ID ${userId}`);
    }

    console.log('\x1b[32m%s\x1b[0m:', `Added ${fakeRunsCount} fake runs in total`);
}

connect().then(async (prismaClient) => {
    await createUsers(prismaClient);
    await createFriendships(prismaClient);
    await createRuns(prismaClient);

    console.log();
    console.log('\x1b[32m%s\x1b[0m:', "Seeding completed successfully!");
    process.exit(0);
}).catch(err => {
    console.log(err);
    process.exit(1);
});

// haversine formula
function calculateDistance(location1: { lat: number, lng: number}, location2: { lat: number, lng: number}) {
    const earthRadius = 6371000; // meters
    const dLat = (location2.lat - location1.lat) * (Math.PI / 180);
    const dLng = (location2.lng - location1.lng) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(location1.lat * (Math.PI / 180)) * Math.cos(location2.lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance;
}
function getRandomCoordinate(min: number, max: number) {
    const randomCoordinate = (Math.random() * (max - min) + min).toFixed(6);
    return randomCoordinate.padEnd(12, '0'); // Pad with zeros to have a total length of 12 characters
}
function generateRandomLocation(rectangleCoordinates: {
    topLeft: { lat: number, lng: number },
    topRight: { lat: number, lng: number },
    bottomLeft: { lat: number, lng: number },
    bottomRight: { lat: number, lng: number },
}) {
    const latMin = Math.min(rectangleCoordinates.topLeft.lat, rectangleCoordinates.bottomLeft.lat);
    const latMax = Math.max(rectangleCoordinates.topRight.lat, rectangleCoordinates.bottomRight.lat);
    const lngMin = Math.min(rectangleCoordinates.topLeft.lng, rectangleCoordinates.topRight.lng);
    const lngMax = Math.max(rectangleCoordinates.bottomLeft.lng, rectangleCoordinates.bottomRight.lng);

    const randomLat = getRandomCoordinate(latMin, latMax);
    const randomLng = getRandomCoordinate(lngMin, lngMax);

    return { lat: parseFloat(randomLat), lng: parseFloat(randomLng) };
}
function generateCoordinates(mapsRectangleCoordinates: {
    topLeft: { lat: number, lng: number },
    topRight: { lat: number, lng: number },
    bottomLeft: { lat: number, lng: number },
    bottomRight: { lat: number, lng: number },
}) {
    let location1: {lat: number, lng: number}, location2: {lat: number, lng: number}, distance: number;
    do {
        location1 = generateRandomLocation(mapsRectangleCoordinates);
        location2 = generateRandomLocation(mapsRectangleCoordinates);
        distance = calculateDistance(location1, location2);
    } while (distance > 10000);

    return {
        start: location1,
        end: location2,
        distance: distance,
    };
}

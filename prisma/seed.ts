
import {PrismaClient, EnumAuthProvider} from "@prisma/client";
import * as argon2 from "argon2";
import * as process from "process";
import {faker} from '@faker-js/faker';

const EARTH_RADIUS = 6371000; // Radius of the Earth in meters

// fake data
const usersCount = 100;
const minRunsCountPerUser = 0;
const maxRunsCountPerUser = 100;
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

async function checkIfTableExists(prismaClient: PrismaClient, tableName: string): Promise<unknown>
{
    try {
        const tableExists = await prismaClient.$queryRaw`
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = '${tableName}'
            );
        `;

        return tableExists;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function createUsers(prismaClient: PrismaClient): Promise<any>
{
    const hashedPassword = await argon2.hash(process.env.DEV_USER_PASSWORD || 'password');

    const users = [];
    users.push({
        auth_provider: EnumAuthProvider.EMAIL, // default
        hash: hashedPassword,
        name: process.env.DEV_USER_NAME || 'User 1',
        email: process.env.DEV_USER_EMAIL || 'user1@gmail.com',
        username: process.env.DEV_USER_USERNAME || 'user1',
        birth_date: faker.date.birthdate({
            mode: 'year',
            min: userMinBirthYear,
            max: userMaxBirthYear,
        }).toISOString().substring(0, 10),
        gender: faker.helpers.arrayElement(['unknown', 'male', 'female', 'other']),
    });

    for (let i = 1; i < usersCount; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const usernameNonFiltered = faker.internet.userName({firstName, lastName});
        const username = usernameNonFiltered.toLowerCase().replace(/[^a-zA-Z0-9_]/g, '');
        const emailParts = faker.internet.email({firstName, lastName}).split('@');
        const emailLocalPart = emailParts[0].replace(/[^a-zA-Z0-9.]/g, '');
        const email = emailLocalPart.toLowerCase() + '@' + emailParts[1];

        const userWithEmailOrUsername = await prismaClient.user.findFirst({
            where: {OR: [{username}, {email}]}
        });
        if (userWithEmailOrUsername) {
            i--;
            continue;
        }

        users.push({
            auth_provider: EnumAuthProvider.EMAIL, // default
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

async function createFriendships(prismaClient: PrismaClient): Promise<any>
{
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
        for (let receiverId = 1; receiverId <= usersCount; receiverId++) {
            if (senderId !== receiverId && faker.datatype.boolean(0.3)) {
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
                    senderId,
                    receiverId,
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
    let fakeRunsCount = 0;
    for (let userId = 1; userId <= usersCount; userId++) {
        const userRunsCount = faker.number.int({ min: minRunsCountPerUser, max: maxRunsCountPerUser });
        fakeRunsCount += userRunsCount;
        const userRuns = [];

        // Define a random timestamp between 3 months ago and 1 week ago
        let timestamp = Date.now() - faker.number.int({ min: 7, max: 90 }) * 24 * 60 * 60 * 1000;

        for (let i = 0; i < userRunsCount; i++) {
            const dateHour = new Date(timestamp).getHours();
            let title = "";

            if (dateHour >= 6 && dateHour < 12) { title = "Morning Run"; }
            else if (dateHour >= 12 && dateHour < 18) { title = "Afternoon Run"; }
            else if (dateHour >= 18 && dateHour < 24) { title = "Evening Run"; }
            else { title = "Night Run"; }

            const coordinatesRectangle = {
                topLeft: { lat: 44.662052, lng: -114.447634 },
                topRight: { lat: 44.270990, lng: -89.847386 },
                bottomLeft: { lat: 35.030414, lng: -115.735263 },
                bottomRight: { lat: 34.999016, lng: -91.073858 },
            };
            const coordinatesCountToGenerate = 100;
            const maxDistanceBetweenCoordinates = 100; // In meters

            const generatedCoordinates = generateCoordinatesInSequence(
                coordinatesRectangle,
                coordinatesCountToGenerate,
                maxDistanceBetweenCoordinates
            );

            userRuns.push({
                userId,
                // calories_burned: Math.floor(runMinutes * 11.4), // ~11.4 calories per minute
                // elevation_gain: faker.number.int({min: -100, max: 100}),
                // heart_rate_avg: faker.number.int({min: 60, max: 200}),
                // temperature: faker.number.int({min: 10, max: 30}), // Celsius
                // terrain: faker.helpers.arrayElement(['unknown', 'road', 'trail', 'track']),
                // weather: faker.helpers.arrayElement(['unknown', 'sunny', 'cloudy', 'rainy', 'snowy', 'windy']),
                // notes: faker.lorem.sentence(),
                title: title,
                started_at: new Date(timestamp), // Use the sequentially increasing timestamp
                completed_at: new Date(timestamp + (generatedCoordinates.length - 1) * 1000), // Calculate completed_at based on coordinates
                coordinates_count: generatedCoordinates.length,
                first_coordinate_lat: parseFloat(generatedCoordinates[0].lat),
                first_coordinate_lng: parseFloat(generatedCoordinates[0].lng),
                last_coordinate_lat: parseFloat(generatedCoordinates[generatedCoordinates.length - 1].lat),
                last_coordinate_lng: parseFloat(generatedCoordinates[generatedCoordinates.length - 1].lng),
                pauses_count: 0,
                distance: generatedCoordinates[generatedCoordinates.length - 1].distance_total,
                distance_pauses_included: generatedCoordinates[generatedCoordinates.length - 1].distance_total,
                duration: generatedCoordinates[generatedCoordinates.length - 1].duration_total,
                duration_pauses_included: generatedCoordinates[generatedCoordinates.length - 1].duration_total,
                avg_speed: generatedCoordinates[generatedCoordinates.length - 1].avg_speed_total,
                avg_speed_pauses_included: generatedCoordinates[generatedCoordinates.length - 1].avg_speed_total,
                coordinates: JSON.stringify(generatedCoordinates),
            });

            // Increment timestamp for the next run by a random amount of time between 1 and 48 hours
            const randomAdditionalTime = faker.number.int({ min: 1, max: 48 }) * 60 * 60 * 1000;
            timestamp += randomAdditionalTime + (generatedCoordinates.length - 1) * 1000;
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
    const usersTableExists = await checkIfTableExists(prismaClient, 'users');
    if (!usersTableExists) {
        console.log('\x1b[31m%s\x1b[0m:', "No seed data was added!");
        process.exit(1);
    }

    await createUsers(prismaClient);
    await createFriendships(prismaClient);
    await createRuns(prismaClient);

    console.log();
    console.log('\x1b[32m%s\x1b[0m:', "Seeding completed successfully");
    process.exit(0);
}).catch(err => {
    console.log(err);
    process.exit(1);
});

// Types definitions
type Coordinate = {
    lat: number;
    lng: number;
}
type Rectangle = {
    topLeft: Coordinate;
    topRight: Coordinate;
    bottomLeft: Coordinate;
    bottomRight: Coordinate;
}

// Function to generate a random coordinate within the given rectangle
function getRandomCoordinateInRectangle(rectangle: Rectangle): Coordinate
{
    const randomLat = Math.random() * (rectangle.topLeft.lat - rectangle.bottomLeft.lat) + rectangle.bottomLeft.lat;
    const randomLng = Math.random() * (rectangle.topRight.lng - rectangle.topLeft.lng) + rectangle.topLeft.lng;
    return { lat: randomLat, lng: randomLng };
}

// Function to calculate the distance between two coordinates using the Haversine formula
function calculateDistance(coordinate1: Coordinate, coordinate2: Coordinate): number
{
    const dLat = (coordinate2.lat - coordinate1.lat) * (Math.PI / 180);
    const dLng = (coordinate2.lng - coordinate1.lng) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(coordinate1.lat * (Math.PI / 180)) * Math.cos(coordinate2.lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS * c;
}

// Function to generate a new coordinate within a given meters of the given coordinate
function generateRandomCoordinateWithinRadius(coordinate: Coordinate, maxDistance: number, maxAngle = 5): Coordinate
{
    // Generate a random angle between 0 and maxAngle (in degrees)
    const randomAngle = Math.random() * maxAngle * (Math.PI / 180); // Convert degrees to radians

    // Generate a random distance within the given radius
    const randomDistance = Math.random() * maxDistance;

    // Convert distance to latitude and longitude offsets
    const latOffset = (randomDistance / EARTH_RADIUS) * (180 / Math.PI);
    const lngOffset = (randomDistance / EARTH_RADIUS) * (180 / Math.PI) / Math.cos(coordinate.lat * (Math.PI / 180));

    // Calculate the new coordinates
    const newLat = coordinate.lat + latOffset * Math.cos(randomAngle);
    const newLng = coordinate.lng + lngOffset * Math.sin(randomAngle);

    return { lat: newLat, lng: newLng };
}

// Function to generate a sequence of coordinates within the given rectangle
function generateCoordinatesInSequence(rectangle: Rectangle, numCoordinates: number, maxDistanceBetweenCoordinates: number): {
    lat: string,
    lng: string,
    timestamp: number,
    distance_piece: number,
    distance_total: number,
    duration_piece: number,
    duration_total: number,
    avg_speed_piece: number,
    avg_speed_total: number,
}[]
{
    const coordinates = [];
    let currentCoordinate = getRandomCoordinateInRectangle(rectangle);
    const randomDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const timestamp = randomDate.getTime();

    coordinates.push({
        lat: currentCoordinate.lat.toFixed(7),
        lng: currentCoordinate.lng.toFixed(7),
        timestamp: Math.round(timestamp / 1000),
        distance_piece: 0,
        distance_total: 0,
        duration_piece: 0,
        duration_total: 0,
        avg_speed_piece: 0,
        avg_speed_total: 0,
    });

    for (let i = 1; i < numCoordinates; i++) {
        const newCoordinate = generateRandomCoordinateWithinRadius(currentCoordinate, maxDistanceBetweenCoordinates);
        const distance = calculateDistance(currentCoordinate, newCoordinate);
        const duration_piece = Math.random() * 10 + 10; // Random duration between 10 and 20 seconds

        const timestamp = coordinates[i - 1].timestamp * 1000 + duration_piece * 1000;
        const distance_piece = distance;
        const distance_total = coordinates[i - 1].distance_total + distance_piece;
        const duration_total = coordinates[i - 1].duration_total + duration_piece;
        const avg_speed_piece = distance_piece / duration_piece;
        const avg_speed_total = distance_total / duration_total;

        coordinates.push({
            lat: newCoordinate.lat.toFixed(7),
            lng: newCoordinate.lng.toFixed(7),
            timestamp: Math.round(timestamp / 1000),
            distance_piece: Math.round(distance_piece),
            distance_total: Math.round(distance_total),
            duration_piece: Math.round(duration_piece),
            duration_total: Math.round(duration_total),
            avg_speed_piece: Math.round(avg_speed_piece * 100) / 100,
            avg_speed_total: Math.round(avg_speed_total * 100) / 100,
        });

        currentCoordinate = newCoordinate;
    }

    return coordinates;
}

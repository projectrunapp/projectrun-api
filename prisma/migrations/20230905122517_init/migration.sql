-- CreateEnum
CREATE TYPE "EnumRelationshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "verification_code" TEXT,
    "name" TEXT NOT NULL,
    "birth_date" TEXT,
    "gender" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatar" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friendships" (
    "id" TEXT NOT NULL,
    "status" "EnumRelationshipStatus" NOT NULL DEFAULT 'PENDING',
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "friendships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "runs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "calories_burned" INTEGER NOT NULL DEFAULT 0,
    "elevation_gain" INTEGER NOT NULL DEFAULT 0,
    "heart_rate_avg" INTEGER,
    "temperature" INTEGER,
    "terrain" TEXT,
    "weather" TEXT,
    "notes" TEXT,
    "title" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL,
    "coordinates_count" INTEGER NOT NULL,
    "first_coordinate_lat" DOUBLE PRECISION NOT NULL,
    "first_coordinate_lng" DOUBLE PRECISION NOT NULL,
    "last_coordinate_lat" DOUBLE PRECISION NOT NULL,
    "last_coordinate_lng" DOUBLE PRECISION NOT NULL,
    "pauses_count" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,
    "distance_pauses_included" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "duration_pauses_included" INTEGER NOT NULL,
    "avg_speed" DOUBLE PRECISION NOT NULL,
    "avg_speed_pauses_included" DOUBLE PRECISION NOT NULL,
    "coordinates" TEXT NOT NULL,

    CONSTRAINT "runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "runs" ADD CONSTRAINT "runs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

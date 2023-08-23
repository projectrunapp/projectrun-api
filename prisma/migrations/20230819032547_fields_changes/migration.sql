/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `terrain` to the `runs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weather` to the `runs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "runs" ADD COLUMN     "calories_burned" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "datetime_start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "distance" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "elevation_gain" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "heart_rate_avg" INTEGER,
ADD COLUMN     "location_end" TEXT,
ADD COLUMN     "location_start" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "pace_avg" DOUBLE PRECISION,
ADD COLUMN     "temperature" INTEGER,
ADD COLUMN     "terrain" TEXT NOT NULL,
ADD COLUMN     "weather" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "birth_date" TEXT,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tester" BOOLEAN NOT NULL DEFAULT false;

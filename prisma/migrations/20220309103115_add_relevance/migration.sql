-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "relevance" INTEGER NOT NULL DEFAULT 10;

-- AlterTable
ALTER TABLE "Genre" ADD COLUMN     "relevance" INTEGER NOT NULL DEFAULT 10;

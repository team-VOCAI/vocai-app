/*
  Warnings:

  - You are about to drop the column `contentType` on the `attachments` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `attachments` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `attachments` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `attachments` table. All the data in the column will be lost.
  - Added the required column `fileData` to the `attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileName` to the `attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileSize` to the `attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileType` to the `attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postId` to the `attachments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attachments" DROP COLUMN "contentType",
DROP COLUMN "filename",
DROP COLUMN "size",
DROP COLUMN "url",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fileData" BYTEA NOT NULL,
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "fileSize" INTEGER NOT NULL,
ADD COLUMN     "fileType" TEXT NOT NULL,
ADD COLUMN     "postId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "company" TEXT,
ADD COLUMN     "jobCategory" TEXT,
ADD COLUMN     "tags" TEXT;

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "persona" JSONB;

-- CreateTable
CREATE TABLE "MockInterviewSession" (
    "sessionId" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "summary" TEXT,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MockInterviewSession_pkey" PRIMARY KEY ("sessionId")
);

-- CreateTable
CREATE TABLE "MockInterviewRecord" (
    "interviewId" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answerText" TEXT,
    "summary" TEXT,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MockInterviewRecord_pkey" PRIMARY KEY ("interviewId")
);

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("postId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockInterviewSession" ADD CONSTRAINT "MockInterviewSession_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("profileId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockInterviewRecord" ADD CONSTRAINT "MockInterviewRecord_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "MockInterviewSession"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;

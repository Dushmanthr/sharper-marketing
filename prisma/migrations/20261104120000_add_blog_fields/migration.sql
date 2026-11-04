-- AlterTable
ALTER TABLE `blog_posts` 
    ADD COLUMN `lastEditedById` VARCHAR(191) NULL,
    ADD COLUMN `lastEditedByName` VARCHAR(191) NULL,
    ADD COLUMN `lastEditedByRole` VARCHAR(191) NULL,
    ADD COLUMN `lastEditedAt` DATETIME(3) NULL,
    ADD COLUMN `rejectionReason` TEXT NULL,
    ADD COLUMN `rejectedBy` VARCHAR(191) NULL,
    ADD COLUMN `rejectedAt` DATETIME(3) NULL;


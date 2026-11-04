-- AlterTable
-- Idempotent: the app's runtime helper (ensureEditorColumnsExist) may already have
-- created some of these columns, so each ADD COLUMN is skipped when it exists.

SET @sql = (SELECT IF(EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'blog_posts' AND COLUMN_NAME = 'lastEditedById'), 'SELECT 1', 'ALTER TABLE `blog_posts` ADD COLUMN `lastEditedById` VARCHAR(191) NULL'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'blog_posts' AND COLUMN_NAME = 'lastEditedByName'), 'SELECT 1', 'ALTER TABLE `blog_posts` ADD COLUMN `lastEditedByName` VARCHAR(191) NULL'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'blog_posts' AND COLUMN_NAME = 'lastEditedByRole'), 'SELECT 1', 'ALTER TABLE `blog_posts` ADD COLUMN `lastEditedByRole` VARCHAR(191) NULL'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'blog_posts' AND COLUMN_NAME = 'lastEditedAt'), 'SELECT 1', 'ALTER TABLE `blog_posts` ADD COLUMN `lastEditedAt` DATETIME(3) NULL'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'blog_posts' AND COLUMN_NAME = 'rejectionReason'), 'SELECT 1', 'ALTER TABLE `blog_posts` ADD COLUMN `rejectionReason` TEXT NULL'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'blog_posts' AND COLUMN_NAME = 'rejectedBy'), 'SELECT 1', 'ALTER TABLE `blog_posts` ADD COLUMN `rejectedBy` VARCHAR(191) NULL'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'blog_posts' AND COLUMN_NAME = 'rejectedAt'), 'SELECT 1', 'ALTER TABLE `blog_posts` ADD COLUMN `rejectedAt` DATETIME(3) NULL'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

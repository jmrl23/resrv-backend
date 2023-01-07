-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastUpdated` DATETIME(3) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `email` VARCHAR(191) NOT NULL,
    `givenName` VARCHAR(191) NULL,
    `familyName` VARCHAR(191) NULL,
    `displayName` VARCHAR(191) NULL,
    `picture` VARCHAR(191) NULL,
    `userLevelId` VARCHAR(191) NULL,

    UNIQUE INDEX `User_id_key`(`id`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_userLevelId_key`(`userLevelId`),
    UNIQUE INDEX `User_id_email_key`(`id`, `email`),
    FULLTEXT INDEX `User_givenName_familyName_email_idx`(`givenName`, `familyName`, `email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentInformation` (
    `id` VARCHAR(191) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastUpdated` DATETIME(3) NOT NULL,
    `studentType` ENUM('REGULAR', 'IRREGULAR') NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'NON_BINARY') NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `contactNumber` VARCHAR(191) NULL,
    `studentId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `programId` VARCHAR(191) NOT NULL,
    `classSectionId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `StudentInformation_id_key`(`id`),
    INDEX `StudentInformation_programId_idx`(`programId`),
    INDEX `StudentInformation_classSectionId_idx`(`classSectionId`),
    UNIQUE INDEX `StudentInformation_userId_key`(`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserLevel` (
    `id` VARCHAR(191) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastUpdated` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'REGISTRY', 'STUDENT') NOT NULL DEFAULT 'STUDENT',

    UNIQUE INDEX `UserLevel_id_key`(`id`),
    UNIQUE INDEX `UserLevel_email_key`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Program` (
    `id` VARCHAR(191) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastUpdated` DATETIME(3) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `name` VARCHAR(191) NOT NULL,
    `alias` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `yearCount` INTEGER NOT NULL,

    UNIQUE INDEX `Program_id_key`(`id`),
    UNIQUE INDEX `Program_name_alias_key`(`name`, `alias`),
    FULLTEXT INDEX `Program_name_alias_idx`(`name`, `alias`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `id` VARCHAR(191) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastUpdated` DATETIME(3) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `name` VARCHAR(191) NOT NULL,
    `alias` VARCHAR(191) NOT NULL,
    `programId` VARCHAR(191) NULL,
    `term` ENUM('FIRST', 'SECOND') NOT NULL,

    UNIQUE INDEX `Course_id_key`(`id`),
    INDEX `Course_programId_idx`(`programId`),
    UNIQUE INDEX `Course_name_key`(`name`),
    UNIQUE INDEX `Course_alias_key`(`alias`),
    FULLTEXT INDEX `Course_name_alias_idx`(`name`, `alias`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseSchedule` (
    `id` VARCHAR(191) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastUpdated` DATETIME(3) NOT NULL,
    `day` ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY') NOT NULL,
    `from` DATETIME(3) NOT NULL,
    `to` DATETIME(3) NOT NULL,
    `classSectionId` VARCHAR(191) NULL,
    `courseId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `CourseSchedule_id_key`(`id`),
    INDEX `CourseSchedule_classSectionId_idx`(`classSectionId`),
    INDEX `CourseSchedule_courseId_idx`(`courseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassSection` (
    `id` VARCHAR(191) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastUpdated` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `programId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ClassSection_id_key`(`id`),
    INDEX `ClassSection_programId_idx`(`programId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reservation` (
    `id` VARCHAR(191) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastUpdated` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'DECLINE') NOT NULL DEFAULT 'PENDING',
    `userId` VARCHAR(191) NOT NULL,
    `fileId` VARCHAR(191) NULL,

    UNIQUE INDEX `Reservation_id_key`(`id`),
    INDEX `Reservation_userId_idx`(`userId`),
    INDEX `Reservation_fileId_idx`(`fileId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `id` VARCHAR(191) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fileId` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `userId` VARCHAR(191) NULL,

    UNIQUE INDEX `File_id_key`(`id`),
    UNIQUE INDEX `File_fileId_key`(`fileId`),
    INDEX `File_userId_idx`(`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Log` (
    `id` VARCHAR(191) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `message` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,

    UNIQUE INDEX `Log_id_key`(`id`),
    INDEX `Log_userId_idx`(`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

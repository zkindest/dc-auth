-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `bio` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `avatar` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `refreshToken` VARCHAR(191) NOT NULL,
    `refreshTokenExpiresAt` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Session_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Avatar` (
    `id` VARCHAR(191) NOT NULL,
    `publicId` VARCHAR(191) NOT NULL,
    `format` VARCHAR(191) NOT NULL,
    `version` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Avatar_publicId_key`(`publicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

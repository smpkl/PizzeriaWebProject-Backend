-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               11.5.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping data for table pizzeria_database.categories: ~3 rows (approximately)
DELETE FROM `categories`;
INSERT INTO `categories` (`id`, `name`) VALUES
	(1, 'pizza'),
	(2, 'drink'),
	(3, 'kebab');

-- Dumping data for table pizzeria_database.tags: ~3 rows (approximately)
DELETE FROM `tags`;
INSERT INTO `tags` (`id`, `title`, `color_hex`, `icon`) VALUES
	(1, 'Vegan', 'B1FF33', NULL),
	(2, 'Gluten free', 'FFEB33', NULL),
	(3, 'Sugar free', 'CFF8FF', NULL);

-- Dumping data for table pizzeria_database.users: ~1 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `first_name`, `last_name`, `password`, `email`, `phonenumber`, `address`, `role`) VALUES
	(1, 'Admin', 'Sukunimi', '$2a$10$9r8FLyyG9VjjshLK1PdT5ekvqcXm/2OVNrhx8iuE9wKUuooWrNTdq', 'example@email.com', '012345678', 'Esimerkkikatu 1', 'admin');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

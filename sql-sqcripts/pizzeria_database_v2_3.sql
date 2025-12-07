DROP DATABASE IF EXISTS `pizzeria_database`;
CREATE DATABASE IF NOT EXISTS `pizzeria_database`;
USE `pizzeria_database`;

-- Dumping structure for taulu pizzeria_database.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL, 
  `last_name` varchar(50) NOT NULL, 
  `password` varchar(300) NOT NULL, 
  `email` varchar(80) NOT NULL UNIQUE,
  `phonenumber` varchar(80) NOT NULL,
  `address` varchar(150) NOT NULL, 
  `role` varchar(50) NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Dumping structure for taulu pizzeria_database.announcements
DROP TABLE IF EXISTS `announcements`;
CREATE TABLE IF NOT EXISTS `announcements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `text` varchar(700) NOT NULL,
  `filename` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Dumping structure for taulu pizzeria_database.categories
DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Dumping structure for taulu pizzeria_database.coupons
DROP TABLE IF EXISTS `coupons`;
CREATE TABLE IF NOT EXISTS `coupons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coupon` varchar(50) NOT NULL,
  `discount_percentage` double NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Dumping structure for taulu pizzeria_database.feedbacks
DROP TABLE IF EXISTS `feedbacks`;
CREATE TABLE IF NOT EXISTS `feedbacks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `email` varchar(80) NOT NULL,
  `feedback` varchar(800) NOT NULL,
  `status` varchar(80) NOT NULL,
  `received` datetime NOT NULL,
  `handled` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK__users` (`user_id`),
  CONSTRAINT `FK__users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Dumping structure for taulu pizzeria_database.meals
DROP TABLE IF EXISTS `meals`;
CREATE TABLE IF NOT EXISTS `meals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `price` double NOT NULL,
  `filename` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Dumping structure for taulu pizzeria_database.order
DROP TABLE IF EXISTS `order`;
CREATE TABLE IF NOT EXISTS `order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `order_type` varchar(50) NOT NULL,
  `time_option` varchar(50) NOT NULL,
  `date_time` datetime NOT NULL,
  `delivery_address` varchar(80) NOT NULL,
  `pizzeria_address` varchar(80) NOT NULL,
  `customer_name` varchar(80) NOT NULL,
  `customer_phone` varchar(80) NOT NULL,
  `customer_email` varchar(80) NOT NULL,
  `details` varchar(700) DEFAULT NULL,
  `price` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK__user_id` (`user_id`),
  CONSTRAINT `FK__user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Dumping structure for taulu pizzeria_database.products
DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `ingredients` varchar(700) DEFAULT NULL,
  `price` double NOT NULL,
  `category` int(11) DEFAULT NULL,
  `description` varchar(700) DEFAULT NULL,
  `filename` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_products_categories` (`category`),
  CONSTRAINT `FK_products_categories` FOREIGN KEY (`category`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Dumping structure for taulu pizzeria_database.daily_meals
DROP TABLE IF EXISTS `daily_meals`;
CREATE TABLE IF NOT EXISTS `daily_meals` (
  `day` varchar(50) NOT NULL,
  `meal_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`day`),
  KEY `FK_day_meal_id` (`meal_id`),
  CONSTRAINT `FK_day_meal_id` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Dumping structure for taulu pizzeria_database.tags
DROP TABLE IF EXISTS `tags`;
CREATE TABLE IF NOT EXISTS `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `color_hex` varchar(50) DEFAULT NULL,
  `icon` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Dumping structure for taulu pizzeria_database.locations
DROP TABLE IF EXISTS `locations`;
CREATE TABLE IF NOT EXISTS `locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `address` varchar(100) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- Dumping structure for taulu pizzeria_database.meals_products
DROP TABLE IF EXISTS `meals_products`;
CREATE TABLE IF NOT EXISTS `meals_products` (
  `meal_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  PRIMARY KEY (`meal_id`,`product_id`),
  KEY `FK_meal_id` (`meal_id`),
  KEY `FK_product_id` (`product_id`),
  CONSTRAINT `FK_meal_id` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Dumping structure for taulu pizzeria_database.order_products
DROP TABLE IF EXISTS `order_products`;
CREATE TABLE IF NOT EXISTS `order_products` (
  `product_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`order_id`),
  KEY `FK__order_id` (`order_id`),
  KEY `FK_product_id` (`product_id`),
  CONSTRAINT `FK__order_id` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK__product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Dumping structure for taulu pizzeria_database.products_tags
DROP TABLE IF EXISTS `products_tags`;
CREATE TABLE IF NOT EXISTS `products_tags` (
  `product_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`tag_id`),
  KEY `FK_product_id` (`product_id`),
  KEY `FK_tag_id` (`tag_id`),
  CONSTRAINT `FK_products_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_tags_id` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Insert default days into daily_meals table
INSERT INTO daily_meals (day) VALUES ("monday"),("tuesday"),("wednesday"),("thursday"),("friday"),("saturday"),("sunday");

-- Insert default locations into locations table
INSERT INTO locations (name, address, latitude, longitude) 
VALUES ("TBA Pizzeria Pasila", "Pasilankatu 8, 00240, Helsinki", 60.197979, 24.927743), 
("TBA Pizzeria Tikkurila", "Unikkotie 14, 01300, Vantaa", 60.292278, 25.035183 ), 
("TBA Pizzeria Leppävaara", "Leppävaarankatu, 02600, Espoo", 60.217253, 24.808561 ), 
("TBA Pizzeria Myllypuro", "Myllypurontie 6, 00920, Helsinki", 60.223402, 25.076147), 
("TBA Pizzeria Myyrmäki", "Myyrmäenraitti, 01600, Vantaa", 60.265666, 24.851930);

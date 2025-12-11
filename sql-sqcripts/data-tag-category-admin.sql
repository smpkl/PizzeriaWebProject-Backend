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
	(1, 'Pizzas'),
	(2, 'Drinks'),
	(3, 'Sides'),
	(4, 'Desserts');
/*Koodiin on kovakoodattu "Meals" kategoria, jota ei voi antaa  tuotteelle kategoriaksi */

-- Dumping data for table pizzeria_database.tags: ~3 rows (approximately)
DELETE FROM `tags`;
INSERT INTO `tags` (`id`, `title`, `color_hex`, `icon`) VALUES
	(1, 'VEG', 'B1FF33', NULL),
	(2, 'GL', 'FFEB33', NULL),
	(3, 'Sugar free', 'CFF8FF', NULL),
	(4, 'VL', 'C4A484', NULL);

-- Dumping data for table pizzeria_database.users: ~1 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `first_name`, `last_name`, `password`, `email`, `phonenumber`, `address`, `role`) VALUES
	(1, 'Admin', 'Sukunimi', '$2a$10$9r8FLyyG9VjjshLK1PdT5ekvqcXm/2OVNrhx8iuE9wKUuooWrNTdq', 'example@email.com', '012345678', 'Esimerkkikatu 1', 'admin');

DELETE FROM `products`;
INSERT INTO `products` (`id`, `name`, `ingredients`, `price`, `category`, `description`) VALUES
(1, 'Opera Speciale', 'Tomato sauce, mozzarella, basil, olive oil', 11.95, 1, 'House signature pizza with fresh basil.'),
(2, 'Margherita', 'Tomato sauce, mozzarella, fresh basil', 9.50, 1, 'Classic Italian simplicity.'),
(3, 'Pepperoni', 'Tomato sauce, mozzarella, pepperoni', 10.90, 1, 'A customer favorite with crispy pepperoni.'),
(4, 'Vegetarian Delight', 'Tomato sauce, mozzarella, bell pepper, onion, mushrooms, olives', 11.50, 1, 'Colorful vegetable pizza for veggie lovers.'),
(5, 'Four Cheese', 'Tomato sauce, mozzarella, gorgonzola, parmesan, ricotta', 12.30, 1, 'Rich blend of Italian cheeses.'),
(6, 'Coca-Cola 0.5l', '', 2.90, 2, 'Refreshing classic soda.'),
(7, 'Coca-Cola Zero 0.5l', '', 2.90, 2, 'Sugar-free alternative.'),
(8, 'Water 0.5l', '', 2.00, 2, 'Pure refereshing water.'),
(9, 'Ice Tea Peach 0.5l', '', 2.80, 2, 'Light and fruity peach iced tea.'),
(10, 'Garlic Bread', 'Bread, garlic butter, parsley', 4.50, 3, 'Warm garlic bread with herbs.'),
(11, 'Mozzarella Sticks', 'Mozzarella, breadcrumbs', 6.20, 3, 'Golden fried cheese sticks.'),
(12, 'Side Salad', 'Lettuce, tomato, cucumber, vinaigrette', 4.90, 3, 'Light and fresh salad.'),
(13, 'Tiramisu', 'Mascarpone, espresso, ladyfingers, cocoa', 5.50, 4, 'Traditional Italian dessert.'),
(14, 'Vanilla Ice Cream Cup', 'Milk, vanilla, sugar', 3.90, 4, 'Smooth vanilla ice cream.');

DELETE FROM `products_tags`;
INSERT INTO `products_tags` (`product_id`, `tag_id`) VALUES
(1, 4),        
(2, 1),       
(2, 4),       
(3, 4),        
(4, 1),        
(4, 4),       
(5, 1),        
(5, 4),        
(7, 3),       
(8, 3),        
(8, 2),       
(8, 4),        
(9, 2),       
(10, 1),       
(11, 1),       
(12, 1),       
(12, 2),       
(14, 4);  

DELETE FROM `meals`;
INSERT INTO `meals` (`id`, `name`, `price`) VALUES
(1, 'Classic Pizza Meal', 13.90),
(2, 'Veggie Combo', 14.50),
(3, 'Cheese Lovers Meal', 14.90),
(4, 'Pepperoni Set', 13.90),
(5, 'Sweet Treat Combo', 8.90);

DELETE FROM `meals_products`;
INSERT INTO `meals_products` (`meal_id`, `product_id`) VALUES
(1, 1),
(1, 6),

(2, 4),
(2, 12),
(2, 8),

(3, 5),
(3, 11),
(3, 6),

(4, 3),
(4, 10),
(4, 9),

(5, 13),
(5, 14),
(5, 8);

UPDATE `daily_meals` SET `meal_id` = 2 WHERE day = "monday";
UPDATE `daily_meals` SET `meal_id` = 3 WHERE day = "tuesday";
UPDATE `daily_meals` SET `meal_id` = 1 WHERE day = "wednesday";
UPDATE `daily_meals` SET `meal_id` = 4 WHERE day = "thursday";
UPDATE `daily_meals` SET `meal_id` = 1 WHERE day = "friday";
UPDATE `daily_meals` SET `meal_id` = 1 WHERE day = "saturday";
UPDATE `daily_meals` SET `meal_id` = 5 WHERE day = "sunday";


DELETE FROM `announcements`;
INSERT INTO `announcements` (`title`, `text`, `filename`) VALUES 
("Temporary Closure for Maintenance",
"Our restaurant will be closed on XX.XX due to scheduled maintenance. We will reopen the following day as usual. Thank you for your understanding.",
"pizzeria_img.jpg"),
("New Seasonal Menu Available!",
"We are excited to introduce our new seasonal menu starting from XX.XX. Come and enjoy fresh flavors inspired by the season!",
"seasonal_menu.jpg"),
("New Seasonal Menu Available!",
"We are excited to introduce our new seasonal menu starting from XX.XX. Come and enjoy fresh flavors inspired by the season!",
"seasonal_menu.jpg");

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

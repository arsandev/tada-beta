-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 21, 2020 at 11:10 PM
-- Server version: 10.1.35-MariaDB
-- PHP Version: 7.2.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tanda-tangan-online`
--

-- --------------------------------------------------------

--
-- Table structure for table `docs`
--

CREATE TABLE `docs` (
  `id` bigint(225) NOT NULL,
  `id_user` bigint(225) NOT NULL,
  `name` varchar(191) NOT NULL,
  `docs` text NOT NULL,
  `rules` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `docs`
--

INSERT INTO `docs` (`id`, `id_user`, `name`, `docs`, `rules`) VALUES
(1, 1, 'LKS Nas Peserta', '1600721991998_Surat Pernyataan Peserta Kesanggupan Mengikuti LKS.docx', '');

-- --------------------------------------------------------

--
-- Table structure for table `doc_copy`
--

CREATE TABLE `doc_copy` (
  `id` bigint(225) NOT NULL,
  `id_copy_file` bigint(225) NOT NULL,
  `id_doc_party` bigint(225) NOT NULL,
  `id_user` bigint(225) NOT NULL,
  `status` enum('0','1') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `doc_copy_file`
--

CREATE TABLE `doc_copy_file` (
  `id` bigint(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `doc_copy_file`
--

INSERT INTO `doc_copy_file` (`id`) VALUES
(3),
(4);

-- --------------------------------------------------------

--
-- Table structure for table `doc_party`
--

CREATE TABLE `doc_party` (
  `id` bigint(225) NOT NULL,
  `id_doc` bigint(225) NOT NULL,
  `name` varchar(100) NOT NULL,
  `data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(225) NOT NULL,
  `username` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `status` enum('admin','party') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `status`) VALUES
(1, 'admin', '$2a$10$wEqzjozdZbkme0OiYGgovuHELToG3flUN8zpg2/QOsCZGx8oxm4vy', 'admin'),
(18, 'tegar', '$2a$10$9RRy1bgIxFKYh0P6g0y1eeeB1QXNdSjiRIgaZCboKDjIaywOeAJ0e', 'party');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `docs`
--
ALTER TABLE `docs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `foreign_id_user_docs` (`id_user`);

--
-- Indexes for table `doc_copy`
--
ALTER TABLE `doc_copy`
  ADD PRIMARY KEY (`id`),
  ADD KEY `foreign_id_user_doc_copy` (`id_user`),
  ADD KEY `foreign_id_doc_party_doc_copy` (`id_doc_party`),
  ADD KEY `foreign_id_copy_file` (`id_copy_file`);

--
-- Indexes for table `doc_copy_file`
--
ALTER TABLE `doc_copy_file`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `doc_party`
--
ALTER TABLE `doc_party`
  ADD PRIMARY KEY (`id`),
  ADD KEY `foreign_id_doc_doc_party` (`id_doc`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `docs`
--
ALTER TABLE `docs`
  MODIFY `id` bigint(225) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `doc_copy`
--
ALTER TABLE `doc_copy`
  MODIFY `id` bigint(225) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `doc_copy_file`
--
ALTER TABLE `doc_copy_file`
  MODIFY `id` bigint(225) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `doc_party`
--
ALTER TABLE `doc_party`
  MODIFY `id` bigint(225) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(225) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `docs`
--
ALTER TABLE `docs`
  ADD CONSTRAINT `foreign_id_user_docs` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `doc_copy`
--
ALTER TABLE `doc_copy`
  ADD CONSTRAINT `foreign_id_copy_file` FOREIGN KEY (`id_copy_file`) REFERENCES `doc_copy_file` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `foreign_id_doc_party_doc_copy` FOREIGN KEY (`id_doc_party`) REFERENCES `doc_party` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `foreign_id_user_doc_copy` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `doc_party`
--
ALTER TABLE `doc_party`
  ADD CONSTRAINT `foreign_id_doc_doc_party` FOREIGN KEY (`id_doc`) REFERENCES `docs` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

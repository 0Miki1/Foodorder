-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2023. Már 31. 05:03
-- Kiszolgáló verziója: 10.4.17-MariaDB
-- PHP verzió: 7.4.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `foodorder`
--
CREATE DATABASE IF NOT EXISTS `foodorder` DEFAULT CHARACTER SET utf8 COLLATE utf8_hungarian_ci;
USE `foodorder`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `cim`
--

CREATE TABLE `cim` (
  `id` int(50) NOT NULL,
  `megrendeloId` varchar(50) COLLATE utf8_hungarian_ci NOT NULL,
  `varos` varchar(50) COLLATE utf8_hungarian_ci NOT NULL,
  `iranyitoszam` char(4) COLLATE utf8_hungarian_ci NOT NULL,
  `utca` varchar(50) COLLATE utf8_hungarian_ci NOT NULL,
  `hazszam` varchar(20) COLLATE utf8_hungarian_ci NOT NULL,
  `emelet` varchar(10) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `ajto` varchar(10) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `kapucsengo` varchar(10) COLLATE utf8_hungarian_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `cim`
--

INSERT INTO `cim` (`id`, `megrendeloId`, `varos`, `iranyitoszam`, `utca`, `hazszam`, `emelet`, `ajto`, `kapucsengo`) VALUES
(11, 'minta.megrendelo1@gmail.com', 'Budapest', '1214', 'Kossuth Lajos utca', '122', '4', '24', '24');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `etel`
--

CREATE TABLE `etel` (
  `nev` varchar(50) COLLATE utf8_hungarian_ci NOT NULL,
  `etteremId` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
  `ar` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `etel`
--

INSERT INTO `etel` (`nev`, `etteremId`, `ar`) VALUES
('BBQ-Bacon 31cm', 'Pizza Hut Csepel Pláza', 3100),
('Big Mac McMenü Plusz', 'McDonald\'s Gyömrői Út', 2800),
('Dupla Sajtos McRoyal McMenü', 'McDonald\'s Gyömrői Út', 3000),
('Gyros Pitában', 'Döner Kebab Budapest', 1400),
('Gyros Tál', 'Döner Kebab Budapest', 1900),
('Gyros Tortilla', 'Döner Kebab Budapest', 1600),
('Hawaii 38cm', 'Pizza Hut Csepel Pláza', 3800),
('Margarita 27cm', 'Pizza Hut Csepel Pláza', 2600),
('Sajtburger', 'McDonald\'s Gyömrői Út', 650);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `etterem`
--

CREATE TABLE `etterem` (
  `nev` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
  `poz_lat` varchar(200) COLLATE utf8_hungarian_ci NOT NULL,
  `poz_lng` varchar(200) COLLATE utf8_hungarian_ci NOT NULL,
  `tipus` varchar(50) COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `etterem`
--

INSERT INTO `etterem` (`nev`, `poz_lat`, `poz_lng`, `tipus`) VALUES
('Döner Kebab Budapest', '47.4956249', '19.0725962', 'Török'),
('McDonald\'s Gyömrői Út', '47.4670052', '19.154574', 'Amerikai'),
('Pizza Hut Csepel Pláza', '47.4241008', '19.0675645', 'Pizza');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `futar`
--

CREATE TABLE `futar` (
  `email` varchar(50) COLLATE utf8_hungarian_ci NOT NULL,
  `jelszo` varchar(256) COLLATE utf8_hungarian_ci NOT NULL,
  `nev` varchar(50) COLLATE utf8_hungarian_ci NOT NULL,
  `poz_lat` varchar(200) COLLATE utf8_hungarian_ci NOT NULL,
  `poz_lng` varchar(200) COLLATE utf8_hungarian_ci NOT NULL,
  `online_e` int(1) NOT NULL,
  `van_cime` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `futar`
--

INSERT INTO `futar` (`email`, `jelszo`, `nev`, `poz_lat`, `poz_lng`, `online_e`, `van_cime`) VALUES
('minta.futar1@gmail.com', '13e1fcd561411ebda6304a3ddd01fd8af4e93f148ee2875f08a834f88d5ea430', 'Minta Futár 1', '47.3249', '18.9971', 0, 0),
('minta.futar2@gmail.com', 'b541de5c7fa507b2f18d38af566e41cbddf23e127951fa21265feca04c30641c', 'Minta Futár 2', '0', '0', 0, 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kosar`
--

CREATE TABLE `kosar` (
  `rendelesId` int(50) NOT NULL,
  `tetelId` varchar(50) COLLATE utf8_hungarian_ci NOT NULL,
  `darab` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `megrendelo`
--

CREATE TABLE `megrendelo` (
  `email` varchar(50) COLLATE utf8_hungarian_ci NOT NULL,
  `jelszo` varchar(256) COLLATE utf8_hungarian_ci NOT NULL,
  `vezeteknev` varchar(50) COLLATE utf8_hungarian_ci NOT NULL,
  `keresztnev` varchar(50) COLLATE utf8_hungarian_ci NOT NULL,
  `telefonszam` varchar(30) COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `megrendelo`
--

INSERT INTO `megrendelo` (`email`, `jelszo`, `vezeteknev`, `keresztnev`, `telefonszam`) VALUES
('minta.megrendelo1@gmail.com', '8e2d8da8699847294145dceee2e2da389a74b0db4bb1cdfd32ff17bddd2ed5ee', 'Minta', 'Megrendelő', '+36308573624');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rendeles`
--

CREATE TABLE `rendeles` (
  `id` int(50) NOT NULL,
  `megrendeloId` varchar(50) COLLATE utf8_hungarian_ci NOT NULL,
  `cimId` int(50) NOT NULL,
  `futarId` varchar(50) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `etteremId` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
  `allapot` int(2) NOT NULL,
  `teljesitett` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `cim`
--
ALTER TABLE `cim`
  ADD PRIMARY KEY (`id`),
  ADD KEY `megrendeloId` (`megrendeloId`);

--
-- A tábla indexei `etel`
--
ALTER TABLE `etel`
  ADD PRIMARY KEY (`nev`),
  ADD KEY `etteremId` (`etteremId`);

--
-- A tábla indexei `etterem`
--
ALTER TABLE `etterem`
  ADD PRIMARY KEY (`nev`);

--
-- A tábla indexei `futar`
--
ALTER TABLE `futar`
  ADD PRIMARY KEY (`email`);

--
-- A tábla indexei `kosar`
--
ALTER TABLE `kosar`
  ADD PRIMARY KEY (`rendelesId`,`tetelId`),
  ADD KEY `tetelId` (`tetelId`);

--
-- A tábla indexei `megrendelo`
--
ALTER TABLE `megrendelo`
  ADD PRIMARY KEY (`email`);

--
-- A tábla indexei `rendeles`
--
ALTER TABLE `rendeles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `megrendeloId` (`megrendeloId`),
  ADD KEY `cimId` (`cimId`),
  ADD KEY `futarId` (`futarId`),
  ADD KEY `etteremId` (`etteremId`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `cim`
--
ALTER TABLE `cim`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT a táblához `rendeles`
--
ALTER TABLE `rendeles`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `cim`
--
ALTER TABLE `cim`
  ADD CONSTRAINT `cim_ibfk_1` FOREIGN KEY (`megrendeloId`) REFERENCES `megrendelo` (`email`);

--
-- Megkötések a táblához `etel`
--
ALTER TABLE `etel`
  ADD CONSTRAINT `etel_ibfk_1` FOREIGN KEY (`etteremId`) REFERENCES `etterem` (`nev`);

--
-- Megkötések a táblához `kosar`
--
ALTER TABLE `kosar`
  ADD CONSTRAINT `kosar_ibfk_1` FOREIGN KEY (`rendelesId`) REFERENCES `rendeles` (`id`),
  ADD CONSTRAINT `kosar_ibfk_2` FOREIGN KEY (`tetelId`) REFERENCES `etel` (`nev`);

--
-- Megkötések a táblához `rendeles`
--
ALTER TABLE `rendeles`
  ADD CONSTRAINT `rendeles_ibfk_1` FOREIGN KEY (`megrendeloId`) REFERENCES `megrendelo` (`email`),
  ADD CONSTRAINT `rendeles_ibfk_2` FOREIGN KEY (`cimId`) REFERENCES `cim` (`id`),
  ADD CONSTRAINT `rendeles_ibfk_3` FOREIGN KEY (`futarId`) REFERENCES `futar` (`email`),
  ADD CONSTRAINT `rendeles_ibfk_4` FOREIGN KEY (`etteremId`) REFERENCES `etterem` (`nev`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

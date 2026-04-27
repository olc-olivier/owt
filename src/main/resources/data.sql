-- Users Table - for authentication
INSERT INTO users (id, username, password, email, role, enabled) VALUES
(1, 'admin', '{noop}password', 'admin@example.com', 'ADMIN', true),
(2, 'john_doe', '{noop}password', 'john@example.com', 'USER', true),
(3, 'jane_smith', '{noop}password', 'jane@example.com', 'USER', true),
(4, 'bob_wilson', '{noop}password', 'bob@example.com', 'MANAGER', true);

-- Boats Table - for fleet management
INSERT INTO boats (id, name, description, length, capacity, year_built, owner_name) VALUES
(1, 'Sea Voyager', 'Sailboat', 45.5, 6, 2015, 'Thrill Seekers'),
(2, 'Blue Horizon', 'Motor Yacht', 52.0, 12, 2018, 'Luxury Cruises Ltd'),
(3, 'Swift Runner', 'Speedboat', 28.0, 4, 2020, 'Adventure Tours'),
(4, 'Ocean Pearl', 'Catamaran', 35.5, 8, 2017, 'Island Hoppers Inc'),
(5, 'Captain Jack', 'Fishing Boat', 32.0, 5, 2019, 'Deep Sea Fishing Co'),
(6, 'Sunset Dream', 'Sailboat', 38.0, 5, 2016, 'Thrill Seekers'),
(7, 'Midnight Express', 'Motor Yacht', 58.0, 14, 2019, 'Premium Yachts'),
(8, 'Wave Rider', 'Speedboat', 25.5, 3, 2021, 'Jet Sports Inc'),
(9, 'Tropical Breeze', 'Catamaran', 40.0, 10, 2018, 'Thrill Seekers'),
(10, 'Harbor Master', 'Fishing Boat', 35.0, 6, 2017, 'Coastal Fisheries'),
(11, 'Starlight', 'Sailboat', 42.0, 7, 2014, 'Seven Seas Sailing'),
(12, 'Neptune King', 'Motor Yacht', 65.0, 16, 2020, 'Thrill Seekers'),
(13, 'Lightning Bolt', 'Speedboat', 22.0, 2, 2022, 'Elite Sailing Academy'),
(14, 'Coral Island', 'Catamaran', 38.5, 9, 2019, 'Elite Sailing Academy'),
(15, 'Deep Catcher', 'Fishing Boat', 38.5, 7, 2018, 'Industrial Fishing'),
(16, 'Morning Glory', 'Sailboat', 41.0, 6, 2016, 'Wind Warriors Club'),
(17, 'Emerald Queen', 'Motor Yacht', 55.0, 11, 2017, 'Elite Sailing Academy'),
(18, 'Turbo Chase', 'Speedboat', 26.5, 4, 2021, 'Racing Boats Ltd'),
(19, 'Twin Fins', 'Catamaran', 37.0, 8, 2020, 'Twin Hull Adventures'),
(20, 'Anchor Down', 'Fishing Boat', 30.0, 4, 2015, 'Bay Fishing Co'),
(21, 'Golden Wind', 'Sailboat', 48.0, 8, 2018, 'Elite Sailing Academy'),
(22, 'Royal Escape', 'Motor Yacht', 60.0, 13, 2019, 'Escape Resorts'),
(23, 'Sonic Splash', 'Speedboat', 24.0, 3, 2022, 'Thrill Seekers'),
(24, 'Paradise Hopper', 'Catamaran', 36.5, 7, 2021, 'Pacific Island Tours'),
(25, 'Storm Chaser', 'Fishing Boat', 33.5, 5, 2019, 'Adventure Fishing'),
(26, 'Silver Sail', 'Sailboat', 43.5, 7, 2017, 'Moonlight Sailing'),
(27, 'Crystal Palace', 'Motor Yacht', 63.0, 15, 2021, 'Luxury Experiences'),
(28, 'Velocity', 'Speedboat', 27.0, 4, 2020, 'Performance Boats'),
(29, 'Ocean Dancer', 'Catamaran', 39.0, 9, 2020, 'Dance With Nature Tours'),
(30, 'Final Catch', 'Fishing Boat', 36.0, 6, 2020, 'Premium Sea Fishing');


-- Advance sequences past the seed data so new inserts don't collide
ALTER TABLE users ALTER COLUMN id RESTART WITH 100;
ALTER TABLE boats ALTER COLUMN id RESTART WITH 100;


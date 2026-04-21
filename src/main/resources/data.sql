-- Users Table - for authentication
INSERT INTO users (id, username, password, email, role, enabled) VALUES
(1, 'admin', '$2a$10$slYQmyNdGzin7olVN3p5be4nCLtiGWYh7mB.0tT8QrE5z0RIhNw3m', 'admin@example.com', 'ADMIN', true),
(2, 'john_doe', '$2a$10$N9qo8uLOickgx2ZMRZoHyewRX2RrNFzqqKW5ugpO1n1RzFyZwBNhe', 'john@example.com', 'USER', true),
(3, 'jane_smith', '$2a$10$V4ZWrLCHCqhfIl3Z2g5p7O0nMxwQ0q8Z1h2j3k4l5m6n7o8p9q0r', 'jane@example.com', 'USER', true),
(4, 'bob_wilson', '$2a$10$X1Y2Z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w', 'bob@example.com', 'MANAGER', true);

-- Boats Table - for fleet management
INSERT INTO boats (id, name, type, length, capacity, year_built, owner_name) VALUES
(1, 'Sea Voyager', 'Sailboat', 45.5, 6, 2015, 'Marina Enterprises'),
(2, 'Blue Horizon', 'Motor Yacht', 52.0, 12, 2018, 'Luxury Cruises Ltd'),
(3, 'Swift Runner', 'Speedboat', 28.0, 4, 2020, 'Adventure Tours'),
(4, 'Ocean Pearl', 'Catamaran', 35.5, 8, 2017, 'Island Hoppers Inc'),
(5, 'Captain Jack', 'Fishing Boat', 32.0, 5, 2019, 'Deep Sea Fishing Co'),
(6, 'Sunset Dream', 'Sailboat', 38.0, 5, 2016, 'Coastal Sailing Club');

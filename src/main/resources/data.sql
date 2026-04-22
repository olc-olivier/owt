-- Users Table - for authentication
INSERT INTO users (id, username, password, email, role, enabled) VALUES
(1, 'admin', '{noop}password', 'admin@example.com', 'ADMIN', true),
(2, 'john_doe', '{noop}password', 'john@example.com', 'USER', true),
(3, 'jane_smith', '{noop}password', 'jane@example.com', 'USER', true),
(4, 'bob_wilson', '{noop}password', 'bob@example.com', 'MANAGER', true);

-- Boats Table - for fleet management
INSERT INTO boats (id, name, type, length, capacity, year_built, owner_name) VALUES
(1, 'Sea Voyager', 'Sailboat', 45.5, 6, 2015, 'Marina Enterprises'),
(2, 'Blue Horizon', 'Motor Yacht', 52.0, 12, 2018, 'Luxury Cruises Ltd'),
(3, 'Swift Runner', 'Speedboat', 28.0, 4, 2020, 'Adventure Tours'),
(4, 'Ocean Pearl', 'Catamaran', 35.5, 8, 2017, 'Island Hoppers Inc'),
(5, 'Captain Jack', 'Fishing Boat', 32.0, 5, 2019, 'Deep Sea Fishing Co'),
(6, 'Sunset Dream', 'Sailboat', 38.0, 5, 2016, 'Coastal Sailing Club');

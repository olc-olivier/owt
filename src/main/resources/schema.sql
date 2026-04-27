-- Users Table Schema
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    enabled BOOLEAN NOT NULL DEFAULT true
);

-- Boats Table Schema
CREATE TABLE boats (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(50) NOT NULL,
    length DOUBLE NOT NULL,
    capacity INT NOT NULL,
    year_built INT NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    created_by VARCHAR(255),
    created_date TIMESTAMP,
    last_modified_by VARCHAR(255),
    last_modified_date TIMESTAMP
);

-- Envers revision info table
CREATE TABLE revinfo (
    rev INT PRIMARY KEY AUTO_INCREMENT,
    revtstmp BIGINT
);

-- Envers audit table for boats
CREATE TABLE boats_aud (
    id BIGINT NOT NULL,
    rev INT NOT NULL,
    revtype TINYINT,
    name VARCHAR(100),
    description VARCHAR(50),
    length DOUBLE,
    capacity INT,
    year_built INT,
    owner_name VARCHAR(100),
    created_by VARCHAR(255),
    created_date TIMESTAMP,
    last_modified_by VARCHAR(255),
    last_modified_date TIMESTAMP,
    PRIMARY KEY (id, rev),
    FOREIGN KEY (rev) REFERENCES revinfo(rev)
);

-- Create indexes for better query performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_boats_description ON boats(description);
CREATE INDEX idx_boats_owner ON boats(owner_name);

-- Création de la table `user`
CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  isAdmin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table `dinosaur`
CREATE TABLE IF NOT EXISTS dinosaur (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  user_id INT NOT NULL,
  diet ENUM('herbivore', 'carnivore', 'omnivore') NOT NULL,
  type ENUM('land', 'air', 'sea') NOT NULL,
  energy INT NOT NULL,
  max_energy INT NOT NULL,
  food INT NOT NULL,
  max_food INT NOT NULL,
  hunger INT NOT NULL,
  max_hunger INT NOT NULL,
  experience INT NOT NULL,
  level INT NOT NULL DEFAULT 1,
  epoch ENUM('past', 'present', 'future') NOT NULL DEFAULT 'past',
  isSleeping BOOLEAN DEFAULT FALSE,
  isDead BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_reborn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reborn_amount INT DEFAULT 0,
  karma INT DEFAULT 0,
  last_update_by_time_service TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Création de la table `dinosaur_multiplier` pour stocker les différents multiplieurs
CREATE TABLE IF NOT EXISTS dinosaur_multiplier (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dinosaur_id INT NOT NULL,
  earn_herbi_food_multiplier FLOAT NOT NULL DEFAULT 1,
  earn_carni_food_multiplier FLOAT NOT NULL DEFAULT 1,
  earn_food_multiplier FLOAT NOT NULL DEFAULT 1,
  earn_energy_multiplier FLOAT NOT NULL DEFAULT 1,
  earn_experience_multiplier FLOAT NOT NULL DEFAULT 1,
  max_energy_multiplier FLOAT NOT NULL DEFAULT 1,
  max_food_multiplier FLOAT NOT NULL DEFAULT 1,
  FOREIGN KEY (dinosaur_id) REFERENCES dinosaur(id) ON DELETE CASCADE
);
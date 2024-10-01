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
  energy INT NOT NULL,
  max_energy INT NOT NULL,
  food INT NOT NULL,
  max_food INT NOT NULL,
  experience INT NOT NULL,
  epoch ENUM('past', 'present', 'future') NOT NULL DEFAULT 'past',
  isSleeping BOOLEAN DEFAULT FALSE,
  isDead BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_update_by_time_service TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

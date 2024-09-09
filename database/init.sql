-- Création de la table `user`
CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table `dinosaur_type`
CREATE TABLE IF NOT EXISTS dinosaur_type (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  species VARCHAR(255) NOT NULL,
  diet ENUM('herbivore', 'carnivore', 'omnivore') NOT NULL
);

-- Création de la table `dinosaur`
CREATE TABLE IF NOT EXISTS dinosaur (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  user_id INT NOT NULL,
  dinosaur_type_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  FOREIGN KEY (dinosaur_type_id) REFERENCES dinosaur_type(id) ON DELETE CASCADE
);

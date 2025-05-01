-- =============================================================================
-- Script d'initialisation de la base de données pour le module dinosaures
-- =============================================================================

-- Création de la table `user`
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  isAdmin BOOLEAN DEFAULT FALSE,
  last_connexion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Nouveaux attributs pour la gestion des points persistants entre vies
  neutral_soul_points INT NOT NULL DEFAULT 0,
  dark_soul_points    INT NOT NULL DEFAULT 0,
  bright_soul_points  INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Nouvelle colonne pour stocker le score global du joueur
  player_score JSON NOT NULL DEFAULT (
    JSON_OBJECT(
      'totalSoulPoints',        0,
      'totalDarkSoulPoints',    0,
      'totalBrightSoulPoints',  0,
      'totalLives',             0,
      'totalKarma',             0,
      'latestKarma',            0,
      'maxKarma',               0,
      'minKarma',               0,
      'averageKarma',           0,
      'negativeLivesCount',     0,
      'positiveLivesCount',     0,
      'totalLifetime',          0,
      'maxLifetime',            0,
      'totalLevels',            0,
      'maxLevel',               0,
      'totalExperience',        0,
      'maxExperience',          0
    )
  )
);

-- ---------------------------------------------------------
-- Table des types de dinosaures
-- ---------------------------------------------------------
DROP TABLE IF EXISTS dinosaur_types;
CREATE TABLE dinosaur_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    stat_modifiers JSON NOT NULL
);

-- Insertion pour "Land"
INSERT INTO dinosaur_types (name, stat_modifiers) VALUES 
('Land', '[
    {"target": "base_max_hunger", "type": "additive", "value": 2500, "source": "type_bonus"},
    {"target": "base_max_energy", "type": "additive", "value": 2500, "source": "type_bonus"},
    {"target": "hunger_increase_multiplier", "type": "multiplicative", "value": -0.25, "source": "type_bonus"},
    {"target": "energy_recovery_multiplier", "type": "multiplicative", "value": 0.25, "source": "type_bonus"}
]');

-- Insertion pour "Air"
INSERT INTO dinosaur_types (name, stat_modifiers) VALUES 
('Air', '[
    {"target": "base_max_energy", "type": "additive", "value": 5000, "source": "type_bonus"},
    {"target": "energy_recovery_multiplier", "type": "multiplicative", "value": 0.50, "source": "type_bonus"}
]');

-- Insertion pour "Sea"
INSERT INTO dinosaur_types (name, stat_modifiers) VALUES 
('Sea', '[
    {"target": "base_max_food", "type": "additive", "value": 5000, "source": "type_bonus"},
    {"target": "hunger_increase_multiplier", "type": "multiplicative", "value": -0.50, "source": "type_bonus"}
]');

-- ---------------------------------------------------------
-- Table des diètes de dinosaures
-- ---------------------------------------------------------
DROP TABLE IF EXISTS dinosaur_diets;
CREATE TABLE dinosaur_diets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    stat_modifiers JSON NOT NULL
);

-- Insertion pour "Herbivore"
INSERT INTO dinosaur_diets (name, stat_modifiers) VALUES 
('Herbivore', '[
    {"target": "hunger_increase_multiplier", "type": "multiplicative", "value": -0.50, "source": "diet_bonus"}
]');

-- Insertion pour "Carnivore"
INSERT INTO dinosaur_diets (name, stat_modifiers) VALUES 
('Carnivore', '[
    {"target": "energy_recovery_multiplier", "type": "multiplicative", "value": 0.50, "source": "diet_bonus"}
]');

-- Insertion pour "Omnivore"
INSERT INTO dinosaur_diets (name, stat_modifiers) VALUES 
('Omnivore', '[
    {"target": "earn_food_global_multiplier", "type": "multiplicative", "value": 0.50, "source": "diet_bonus"}
]');

-- ---------------------------------------------------------
-- Table principale des dinosaures
-- ---------------------------------------------------------
DROP TABLE IF EXISTS dinosaurs;
CREATE TABLE dinosaurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id INT NOT NULL UNIQUE,
    diet_id INT NOT NULL,
    type_id INT NOT NULL,
    -- Valeurs courantes
    energy INT NOT NULL,
    food INT NOT NULL,
    hunger INT NOT NULL,
    weapons INT NOT NULL,
    armors INT NOT NULL,
    friends INT NOT NULL,
    employees INT NOT NULL,
    karma INT NOT NULL,
    experience INT NOT NULL,
    level INT NOT NULL,
    money INT NOT NULL,
    skill_points INT NOT NULL,
    epoch VARCHAR(50) NOT NULL,
    -- Détails techniques
    created_at DATETIME NOT NULL,
    death_date DATETIME DEFAULT NULL,
    last_reborn DATETIME NOT NULL,
    reborn_amount INT NOT NULL,
    last_update_by_time_service DATETIME NOT NULL,
    is_sleeping BOOLEAN NOT NULL,
    is_dead BOOLEAN NOT NULL,
    -- Clés étrangères
    CONSTRAINT fk_dino_diet FOREIGN KEY (diet_id) REFERENCES dinosaur_diets(id),
    CONSTRAINT fk_dino_type FOREIGN KEY (type_id) REFERENCES dinosaur_types(id)
);

-- ---------------------------------------------------------
-- Table Dynamic Events
-- ---------------------------------------------------------
DROP TABLE IF EXISTS dynamic_events;
CREATE TABLE dynamic_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    min_level INT NOT NULL,
    weight INT NOT NULL,
    positivity_score INT NOT NULL,
    descriptions JSON NOT NULL,
    base_modifiers JSON NOT NULL
);

-- ---------------------------------------------------------
-- Table des compétences (skills)
-- ---------------------------------------------------------
DROP TABLE IF EXISTS dinosaur_skills;
CREATE TABLE dinosaur_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INT NOT NULL,
    min_level_to_buy INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    tier INT NOT NULL,
    duration INT,
    stat_modifiers JSON NOT NULL
);

DROP TABLE IF EXISTS dinosaur_skills_instance;
CREATE TABLE dinosaur_skills_instance (
    dinosaur_id INT NOT NULL,
    skill_id INT NOT NULL,
    is_purchased BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN,
    last_activated_at DATETIME,
    PRIMARY KEY (dinosaur_id, skill_id),
    CONSTRAINT fk_dino_skill_instance_dino FOREIGN KEY (dinosaur_id) REFERENCES dinosaurs(id) ON DELETE CASCADE,
    CONSTRAINT fk_dino_skill_instance_skill FOREIGN KEY (skill_id) REFERENCES dinosaur_skills(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------
-- Table des objets (items)
-- ---------------------------------------------------------
DROP TABLE IF EXISTS dinosaur_items;
CREATE TABLE dinosaur_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INT NOT NULL,
    min_level_to_buy INT NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    category VARCHAR(50),
    levels JSON NOT NULL
);

DROP TABLE IF EXISTS dinosaur_items_instance;
CREATE TABLE dinosaur_items_instance (
    dinosaur_id INT NOT NULL,
    item_id INT NOT NULL,
    current_level_or_quantity INT NOT NULL,
    is_equipped BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (dinosaur_id, item_id),
    CONSTRAINT fk_dino_item_instance_dino FOREIGN KEY (dinosaur_id) REFERENCES dinosaurs(id) ON DELETE CASCADE,
    CONSTRAINT fk_dino_item_instance_item FOREIGN KEY (item_id) REFERENCES dinosaur_items(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------
-- Table des bâtiments
-- ---------------------------------------------------------
DROP TABLE IF EXISTS dinosaur_buildings;
CREATE TABLE dinosaur_buildings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INT NOT NULL,
    min_level_to_buy INT NOT NULL,
    max_level INT NOT NULL,
    improvement_tree JSON NOT NULL,
    stat_modifiers JSON NOT NULL
);

DROP TABLE IF EXISTS dinosaur_buildings_instance;
CREATE TABLE dinosaur_buildings_instance (
    dinosaur_id INT NOT NULL,
    building_id INT NOT NULL,
    current_level INT NOT NULL,
    purchased_upgrades JSON NOT NULL,
    PRIMARY KEY (dinosaur_id, building_id),
    CONSTRAINT fk_dino_building_instance_dino FOREIGN KEY (dinosaur_id) REFERENCES dinosaurs(id) ON DELETE CASCADE,
    CONSTRAINT fk_dino_building_instance_building FOREIGN KEY (building_id) REFERENCES dinosaur_buildings(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------
-- Table des soul skills
-- ---------------------------------------------------------
DROP TABLE IF EXISTS dinosaur_soul_skills;
CREATE TABLE dinosaur_soul_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INT NOT NULL,
    soul_type ENUM('neutral','bright','dark') NOT NULL,
    tier INT NOT NULL,
    stat_modifiers JSON NOT NULL
);

DROP TABLE IF EXISTS dinosaur_soul_skills_instance;
CREATE TABLE dinosaur_soul_skills_instance (
    dinosaur_id INT NOT NULL,
    soul_skill_id INT NOT NULL,
    is_unlocked BOOLEAN NOT NULL DEFAULT FALSE,
    purchased_at DATETIME,
    PRIMARY KEY (dinosaur_id, soul_skill_id),
    CONSTRAINT fk_dino_soul_skill_instance_dino FOREIGN KEY (dinosaur_id) REFERENCES dinosaurs(id) ON DELETE CASCADE,
    CONSTRAINT fk_dino_soul_skill_instance_soul_skill FOREIGN KEY (soul_skill_id) REFERENCES dinosaur_soul_skills(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------
-- Table de l'historique des vies du dino
-- ---------------------------------------------------------
DROP TABLE IF EXISTS dinosaur_lives;
CREATE TABLE dinosaur_lives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dinosaur_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    experience INT NOT NULL,
    karma INT NOT NULL,
    level INT NOT NULL,
    birth_date DATETIME NOT NULL,
    death_date DATETIME NOT NULL,
    soul_points INT NOT NULL DEFAULT 0,
    dark_soul_points INT NOT NULL DEFAULT 0,
    bright_soul_points INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dinosaur_lives FOREIGN KEY (dinosaur_id) REFERENCES dinosaurs(id) ON DELETE CASCADE
);

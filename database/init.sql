-- init.sql
-- =============================================================================
-- Script d'initialisation de la base de données pour le module dinosaures
-- =============================================================================

-- ---------------------------------------------------------
-- Table des types de dinosaures
-- Chaque type possède un ensemble de modificateurs génériques stockés en JSON,
-- qui s'appliquent aux caractéristiques de base et aux multiplicateurs d'évolution.
-- Exemple de modificateur : 
-- { "target": "base_energy", "type": "additive", "value": 10, "source": "type" }
-- ---------------------------------------------------------
DROP TABLE IF EXISTS dinosaur_types;
CREATE TABLE dinosaur_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    stat_modifiers JSON NOT NULL
);

-- Insertion exemple pour le type "Land"
INSERT INTO dinosaur_types (name, stat_modifiers) VALUES 
('Land', '[
    {"target": "base_energy", "type": "additive", "value": 10, "source": "type"},
    {"target": "base_max_energy", "type": "additive", "value": 15, "source": "type"},
    {"target": "base_food", "type": "additive", "value": 8, "source": "type"},
    {"target": "base_max_food", "type": "additive", "value": 12, "source": "type"},
    {"target": "base_hunger", "type": "additive", "value": 5, "source": "type"},
    {"target": "base_max_hunger", "type": "additive", "value": 7, "source": "type"},
    {"target": "energy_recovery_multiplier", "type": "additive", "value": 0.10, "source": "type"},
    {"target": "energy_decay_multiplier", "type": "additive", "value": 0.05, "source": "type"},
    {"target": "max_energy_multiplier", "type": "additive", "value": 0.20, "source": "type"},
    {"target": "max_food_multiplier", "type": "additive", "value": 0.15, "source": "type"},
    {"target": "max_hunger_multiplier", "type": "additive", "value": 0.10, "source": "type"},
    {"target": "hunger_increase_multiplier", "type": "additive", "value": 0.05, "source": "type"}
]');

-- Insertion pour "Air"
INSERT INTO dinosaur_types (name, stat_modifiers) VALUES 
('Air', '[
    {"target": "base_energy", "type": "additive", "value": 8, "source": "type"},
    {"target": "base_max_energy", "type": "additive", "value": 12, "source": "type"},
    {"target": "base_food", "type": "additive", "value": 10, "source": "type"},
    {"target": "base_max_food", "type": "additive", "value": 14, "source": "type"},
    {"target": "base_hunger", "type": "additive", "value": 4, "source": "type"},
    {"target": "base_max_hunger", "type": "additive", "value": 6, "source": "type"},
    {"target": "energy_recovery_multiplier", "type": "additive", "value": 0.15, "source": "type"},
    {"target": "energy_decay_multiplier", "type": "additive", "value": 0.04, "source": "type"},
    {"target": "max_energy_multiplier", "type": "additive", "value": 0.25, "source": "type"},
    {"target": "max_food_multiplier", "type": "additive", "value": 0.10, "source": "type"},
    {"target": "max_hunger_multiplier", "type": "additive", "value": 0.12, "source": "type"},
    {"target": "hunger_increase_multiplier", "type": "additive", "value": 0.06, "source": "type"}
]');

-- Insertion pour "Sea"
INSERT INTO dinosaur_types (name, stat_modifiers) VALUES 
('Sea', '[
    {"target": "base_energy", "type": "additive", "value": 9, "source": "type"},
    {"target": "base_max_energy", "type": "additive", "value": 13, "source": "type"},
    {"target": "base_food", "type": "additive", "value": 9, "source": "type"},
    {"target": "base_max_food", "type": "additive", "value": 13, "source": "type"},
    {"target": "base_hunger", "type": "additive", "value": 5, "source": "type"},
    {"target": "base_max_hunger", "type": "additive", "value": 8, "source": "type"},
    {"target": "energy_recovery_multiplier", "type": "additive", "value": 0.12, "source": "type"},
    {"target": "energy_decay_multiplier", "type": "additive", "value": 0.06, "source": "type"},
    {"target": "max_energy_multiplier", "type": "additive", "value": 0.18, "source": "type"},
    {"target": "max_food_multiplier", "type": "additive", "value": 0.17, "source": "type"},
    {"target": "max_hunger_multiplier", "type": "additive", "value": 0.14, "source": "type"},
    {"target": "hunger_increase_multiplier", "type": "additive", "value": 0.07, "source": "type"}
]');

-- ---------------------------------------------------------
-- Table des diètes de dinosaures
-- Chaque diète contient un ensemble de modificateurs génériques stockés en JSON,
-- s'appliquant aux earn multipliers.
-- Exemple : { "target": "earn_food_global_multiplier", "type": "additive", "value": 0.10, "source": "diet" }
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
    {"target": "earn_food_global_multiplier", "type": "additive", "value": 0.10, "source": "diet"},
    {"target": "earn_food_herbi_multiplier", "type": "additive", "value": 0.20, "source": "diet"},
    {"target": "earn_food_carni_multiplier", "type": "additive", "value": 0.00, "source": "diet"},
    {"target": "earn_energy_multiplier", "type": "additive", "value": 0.05, "source": "diet"},
    {"target": "earn_experience_multiplier", "type": "additive", "value": 0.05, "source": "diet"},
    {"target": "earn_skill_point_multiplier", "type": "additive", "value": 0.03, "source": "diet"},
    {"target": "earn_money_multiplier", "type": "additive", "value": 0.02, "source": "diet"},
    {"target": "earn_karma_multiplier", "type": "additive", "value": 0.04, "source": "diet"}
]');

-- Insertion pour "Carnivore"
INSERT INTO dinosaur_diets (name, stat_modifiers) VALUES 
('Carnivore', '[
    {"target": "earn_food_global_multiplier", "type": "additive", "value": 0.05, "source": "diet"},
    {"target": "earn_food_herbi_multiplier", "type": "additive", "value": 0.00, "source": "diet"},
    {"target": "earn_food_carni_multiplier", "type": "additive", "value": 0.20, "source": "diet"},
    {"target": "earn_energy_multiplier", "type": "additive", "value": 0.05, "source": "diet"},
    {"target": "earn_experience_multiplier", "type": "additive", "value": 0.05, "source": "diet"},
    {"target": "earn_skill_point_multiplier", "type": "additive", "value": 0.03, "source": "diet"},
    {"target": "earn_money_multiplier", "type": "additive", "value": 0.02, "source": "diet"},
    {"target": "earn_karma_multiplier", "type": "additive", "value": 0.04, "source": "diet"}
]');

-- Insertion pour "Omnivore"
INSERT INTO dinosaur_diets (name, stat_modifiers) VALUES 
('Omnivore', '[
    {"target": "earn_food_global_multiplier", "type": "additive", "value": 0.08, "source": "diet"},
    {"target": "earn_food_herbi_multiplier", "type": "additive", "value": 0.10, "source": "diet"},
    {"target": "earn_food_carni_multiplier", "type": "additive", "value": 0.10, "source": "diet"},
    {"target": "earn_energy_multiplier", "type": "additive", "value": 0.05, "source": "diet"},
    {"target": "earn_experience_multiplier", "type": "additive", "value": 0.05, "source": "diet"},
    {"target": "earn_skill_point_multiplier", "type": "additive", "value": 0.03, "source": "diet"},
    {"target": "earn_money_multiplier", "type": "additive", "value": 0.02, "source": "diet"},
    {"target": "earn_karma_multiplier", "type": "additive", "value": 0.04, "source": "diet"}
]');

-- ---------------------------------------------------------
-- Table principale des dinosaures
-- Stocke les caractéristiques de base, les earn multipliers, les nouveaux multipliers
-- d'évolution, et les autres attributs de jeu.
--
-- Les champs "energy", "food" et "hunger" représentent les valeurs courantes.
-- Les champs "base_max_energy", "base_max_food" et "base_max_hunger" représentent
-- les valeurs de référence utilisées pour le calcul des valeurs finales.
-- proviennent de constantes stockées en DB et peuvent être ajustées en cas d'urgence.
-- ---------------------------------------------------------
DROP TABLE IF EXISTS dinosaurs;
CREATE TABLE dinosaurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    diet_id INT NOT NULL,
    type_id INT NOT NULL,
    
    -- Valeurs courantes (modifiable par les actions du joueur)
    energy INT NOT NULL,
    food INT NOT NULL,
    hunger INT NOT NULL,
    karma INT NOT NULL,
    experience INT NOT NULL,
    level INT NOT NULL,
    money DECIMAL(10,2) NOT NULL,
    skill_points INT NOT NULL,
    epoch VARCHAR(50) NOT NULL,
    
    -- Details techniques
    created_at DATETIME NOT NULL,
    last_reborn DATETIME NOT NULL,
    reborn_amount INT NOT NULL,
    last_update_by_time_service DATETIME NOT NULL,
    is_sleeping BOOLEAN NOT NULL,
    is_dead BOOLEAN NOT NULL,
    
    -- Clés étrangères
    CONSTRAINT fk_dino_diet FOREIGN KEY (diet_id) REFERENCES dinosaur_diets(id),
    CONSTRAINT fk_dino_type FOREIGN KEY (type_id) REFERENCES dinosaur_types(id)
);

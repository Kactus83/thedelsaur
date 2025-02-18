-- init.sql
-- =============================================================================
-- Script d'initialisation de la base de données 
-- =============================================================================

-- ---------------------------------------------------------
-- Table des types de dinosaures
-- Chaque type possède un ensemble de modificateurs génériques
-- stockés en JSON et s'appliquant aux caractéristiques de base.
-- Exemple de modificateur : { "target": "base_energy", "type": "additive", "value": 10 }
-- ---------------------------------------------------------
DROP TABLE IF EXISTS dinosaur_types;
CREATE TABLE dinosaur_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    -- Stocke un tableau JSON de modificateurs (conformes à l'interface StatModifier)
    stat_modifiers JSON NOT NULL
);

-- Exemple d'insertion pour le type "Land"
INSERT INTO dinosaur_types (name, stat_modifiers) VALUES 
('Land', '[
    {"target": "base_energy", "type": "additive", "value": 10},
    {"target": "base_max_energy", "type": "additive", "value": 15},
    {"target": "base_food", "type": "additive", "value": 8},
    {"target": "base_max_food", "type": "additive", "value": 12},
    {"target": "base_hunger", "type": "additive", "value": 5},
    {"target": "base_max_hunger", "type": "additive", "value": 7}
]');

-- Insertion d'autres types (exemples pour "Air" et "Sea")
INSERT INTO dinosaur_types (name, stat_modifiers) VALUES 
('Air', '[
    {"target": "base_energy", "type": "additive", "value": 8},
    {"target": "base_max_energy", "type": "additive", "value": 12},
    {"target": "base_food", "type": "additive", "value": 10},
    {"target": "base_max_food", "type": "additive", "value": 14},
    {"target": "base_hunger", "type": "additive", "value": 4},
    {"target": "base_max_hunger", "type": "additive", "value": 6}
]');

INSERT INTO dinosaur_types (name, stat_modifiers) VALUES 
('Sea', '[
    {"target": "base_energy", "type": "additive", "value": 9},
    {"target": "base_max_energy", "type": "additive", "value": 13},
    {"target": "base_food", "type": "additive", "value": 9},
    {"target": "base_max_food", "type": "additive", "value": 13},
    {"target": "base_hunger", "type": "additive", "value": 5},
    {"target": "base_max_hunger", "type": "additive", "value": 8}
]');

-- ---------------------------------------------------------
-- Table des diètes de dinosaures
-- Chaque diète contient un ensemble de modificateurs génériques
-- stockés en JSON et s'appliquant aux earn multipliers.
-- Exemple de modificateur : { "target": "earn_food_global_multiplier", "type": "additive", "value": 0.10 }
-- ---------------------------------------------------------
DROP TABLE IF EXISTS dinosaur_diets;
CREATE TABLE dinosaur_diets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    -- Stocke un tableau JSON de modificateurs pour les earn multipliers
    stat_modifiers JSON NOT NULL
);

-- Exemple d'insertion pour la diète "Herbivore"
INSERT INTO dinosaur_diets (name, stat_modifiers) VALUES 
('Herbivore', '[
    {"target": "earn_food_global_multiplier", "type": "additive", "value": 0.10},
    {"target": "earn_food_herbi_multiplier", "type": "additive", "value": 0.20},
    {"target": "earn_food_carni_multiplier", "type": "additive", "value": 0.00},
    {"target": "earn_energy_multiplier", "type": "additive", "value": 0.05},
    {"target": "earn_experience_multiplier", "type": "additive", "value": 0.05},
    {"target": "earn_skill_point_multiplier", "type": "additive", "value": 0.03},
    {"target": "earn_money_multiplier", "type": "additive", "value": 0.02},
    {"target": "earn_karma_multiplier", "type": "additive", "value": 0.04}
]');

-- Insertion pour "Carnivore" et "Omnivore"
INSERT INTO dinosaur_diets (name, stat_modifiers) VALUES 
('Carnivore', '[
    {"target": "earn_food_global_multiplier", "type": "additive", "value": 0.05},
    {"target": "earn_food_herbi_multiplier", "type": "additive", "value": 0.00},
    {"target": "earn_food_carni_multiplier", "type": "additive", "value": 0.20},
    {"target": "earn_energy_multiplier", "type": "additive", "value": 0.05},
    {"target": "earn_experience_multiplier", "type": "additive", "value": 0.05},
    {"target": "earn_skill_point_multiplier", "type": "additive", "value": 0.03},
    {"target": "earn_money_multiplier", "type": "additive", "value": 0.02},
    {"target": "earn_karma_multiplier", "type": "additive", "value": 0.04}
]');

INSERT INTO dinosaur_diets (name, stat_modifiers) VALUES 
('Omnivore', '[
    {"target": "earn_food_global_multiplier", "type": "additive", "value": 0.08},
    {"target": "earn_food_herbi_multiplier", "type": "additive", "value": 0.10},
    {"target": "earn_food_carni_multiplier", "type": "additive", "value": 0.10},
    {"target": "earn_energy_multiplier", "type": "additive", "value": 0.05},
    {"target": "earn_experience_multiplier", "type": "additive", "value": 0.05},
    {"target": "earn_skill_point_multiplier", "type": "additive", "value": 0.03},
    {"target": "earn_money_multiplier", "type": "additive", "value": 0.02},
    {"target": "earn_karma_multiplier", "type": "additive", "value": 0.04}
]');

-- ---------------------------------------------------------
-- Table principale des dinosaures
-- Stocke les caractéristiques de base, les earn multipliers et
-- les autres attributs de jeu.
-- Lors de la création, le dinosaure est initialisé avec ces valeurs de base.
-- Les valeurs finales (sans le préfixe "base") seront calculées à la volée
-- et exposées via le DTO frontend.
-- ---------------------------------------------------------
DROP TABLE IF EXISTS dinosaurs;
CREATE TABLE dinosaurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    diet_id INT NOT NULL,
    type_id INT NOT NULL,
    
    -- Caractéristiques de base (initiales)
    base_energy INT NOT NULL,
    base_max_energy INT NOT NULL,
    base_food INT NOT NULL,
    base_max_food INT NOT NULL,
    base_hunger INT NOT NULL,
    base_max_hunger INT NOT NULL,
    
    -- Earn multipliers stockés dans le dinosaure
    earn_food_global_multiplier DECIMAL(3,2) NOT NULL,
    earn_food_herbi_multiplier DECIMAL(3,2) NOT NULL,
    earn_food_carni_multiplier DECIMAL(3,2) NOT NULL,
    earn_energy_multiplier DECIMAL(3,2) NOT NULL,
    earn_experience_multiplier DECIMAL(3,2) NOT NULL,
    earn_skill_point_multiplier DECIMAL(3,2) NOT NULL,
    earn_money_multiplier DECIMAL(3,2) NOT NULL,
    earn_karma_multiplier DECIMAL(3,2) NOT NULL,
    
    -- Autres attributs de jeu
    hunger INT NOT NULL,
    karma INT NOT NULL,
    experience INT NOT NULL,
    level INT NOT NULL,
    money DECIMAL(10,2) NOT NULL,
    skill_points INT NOT NULL,
    
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

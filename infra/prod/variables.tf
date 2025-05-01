variable "aws_region" {
  description = "AWS region pour déployer la base"
  type        = string
  default     = "eu-west-3"
}

variable "db_name" {
  description = "Nom de la base de données MariaDB"
  type        = string
  default     = "iddlesaur"
}

variable "db_user" {
  description = "Nom d'utilisateur MariaDB"
  type        = string
  default     = "myuser"
}

variable "db_password" {
  description = "Mot de passe MariaDB en production"
  type        = string
  sensitive   = true
}

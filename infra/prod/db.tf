provider "aws" {
  region = var.aws_region
}

data "aws_vpc" "default" {
  default = true
}

data "http" "my_ip" {
  url = "https://ipv4.icanhazip.com/"
}

locals {
  my_cidr = "${trimspace(data.http.my_ip.response_body)}/32"
}

resource "aws_security_group" "rds_access" {
  name        = "${var.db_name}-rds-sg"
  description = "SG principal pour RDS ${var.db_name}"
  vpc_id      = data.aws_vpc.default.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  lifecycle {
    ignore_changes = [ingress]
  }
}

resource "aws_security_group_rule" "rds_mysql_ingress" {
  type              = "ingress"
  from_port         = 3306
  to_port           = 3306
  protocol          = "tcp"
  security_group_id = aws_security_group.rds_access.id
  cidr_blocks       = [local.my_cidr]
  description       = "Autorise MySQL 3306 depuis ma machine (${local.my_cidr})"
}

resource "aws_db_instance" "mariadb" {
  identifier            = "${var.db_name}-db"
  engine                = "mariadb"
  engine_version        = "10.5"
  instance_class        = "db.t3.micro"
  allocated_storage     = 20
  db_name               = var.db_name
  username              = var.db_user
  password              = var.db_password
  backup_retention_period = 7
  publicly_accessible     = true
  vpc_security_group_ids  = [aws_security_group.rds_access.id]
  skip_final_snapshot     = true
}

output "db_endpoint" {
  description = "Hôte:Port du RDS MariaDB"
  value       = "${aws_db_instance.mariadb.address}:${aws_db_instance.mariadb.port}"
}

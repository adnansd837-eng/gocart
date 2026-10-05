terraform {
  required_version = ">= 1.5.0"
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.2"
    }
  }
}

provider "docker" {}

# Network
resource "docker_network" "gocart_network" {
  name = "gocart-infra-network"
}

# Persistent Volume for Postgres
resource "docker_volume" "postgres_data" {
  name = "gocart-postgres-volume"
}

# PostgreSQL Container
resource "docker_container" "postgres" {
  name  = "gocart-postgres-tf"
  image = "postgres:16-alpine"
  networks_advanced {
    name = docker_network.gocart_network.name
  }
  env = [
    "POSTGRES_USER=${var.db_user}",
    "POSTGRES_PASSWORD=${var.db_password}",
    "POSTGRES_DB=${var.db_name}"
  ]
  ports {
    internal = 5432
    external = var.db_port
  }
  volumes {
    volume_name    = docker_volume.postgres_data.name
    container_path = "/var/lib/postgresql/data"
  }
}

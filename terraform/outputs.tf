output "postgres_container_name" {
  value = docker_container.postgres.name
}

output "database_url" {
  value     = "postgresql://${var.db_user}:${var.db_password}@localhost:${var.db_port}/${var.db_name}?schema=public"
  sensitive = true
}

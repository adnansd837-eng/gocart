variable "db_user" {
  description = "PostgreSQL Username"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "PostgreSQL Password"
  type        = string
  default     = "postgres_secure_pw"
  sensitive   = true
}

variable "db_name" {
  description = "PostgreSQL Database Name"
  type        = string
  default     = "gocart"
}

variable "db_port" {
  description = "Host Port for PostgreSQL"
  type        = number
  default     = 5432
}

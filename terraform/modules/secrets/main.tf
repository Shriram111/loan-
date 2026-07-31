variable "project" { type = string }
variable "env" { type = string }
variable "db_password" { type = string; sensitive = true }
variable "jwt_secret" { type = string; sensitive = true }
variable "jwt_refresh_secret" { type = string; sensitive = true }
variable "tags" { type = map(string) }

resource "aws_secretsmanager_secret" "db_password" {
  name = "${var.project}/${var.env}/db-password"
  tags = var.tags
}
resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = var.db_password
}

resource "aws_secretsmanager_secret" "jwt_secret" {
  name = "${var.project}/${var.env}/jwt-secret"
  tags = var.tags
}
resource "aws_secretsmanager_secret_version" "jwt_secret" {
  secret_id     = aws_secretsmanager_secret.jwt_secret.id
  secret_string = var.jwt_secret
}

resource "aws_secretsmanager_secret" "jwt_refresh_secret" {
  name = "${var.project}/${var.env}/jwt-refresh-secret"
  tags = var.tags
}
resource "aws_secretsmanager_secret_version" "jwt_refresh_secret" {
  secret_id     = aws_secretsmanager_secret.jwt_refresh_secret.id
  secret_string = var.jwt_refresh_secret
}

output "db_password_arn" { value = aws_secretsmanager_secret.db_password.arn }
output "jwt_secret_arn" { value = aws_secretsmanager_secret.jwt_secret.arn }
output "jwt_refresh_secret_arn" { value = aws_secretsmanager_secret.jwt_refresh_secret.arn }

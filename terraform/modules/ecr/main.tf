variable "project" { type = string }
variable "env" { type = string }
variable "tags" { type = map(string) }

resource "aws_ecr_repository" "backend" {
  name                 = "${var.project}-${var.env}-backend"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
  tags = merge(var.tags, { Name = "${var.project}-${var.env}-ecr" })
}

resource "aws_ecr_lifecycle_policy" "backend" {
  repository = aws_ecr_repository.backend.name
  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 10 images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 10
      }
      action = { type = "expire" }
    }]
  })
}

output "repository_url" { value = aws_ecr_repository.backend.repository_url }
output "repository_name" { value = aws_ecr_repository.backend.name }

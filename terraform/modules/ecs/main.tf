variable "project" { type = string }
variable "env" { type = string }
variable "vpc_id" { type = string }
variable "private_subnet_ids" { type = list(string) }
variable "alb_security_group_id" { type = string }
variable "target_group_arn" { type = string }
variable "ecs_task_execution_role_arn" { type = string }
variable "ecs_task_role_arn" { type = string }
variable "ecr_repository_url" { type = string }
variable "db_password" { type = string; sensitive = true }
variable "jwt_secret" { type = string; sensitive = true }
variable "jwt_refresh_secret" { type = string; sensitive = true }
variable "client_url" { type = string }
variable "tags" { type = map(string) }

resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/${var.project}-${var.env}-backend"
  retention_in_days = 30
  tags = var.tags
}

resource "aws_ecs_cluster" "main" {
  name = "${var.project}-${var.env}-cluster"
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
  tags = var.tags
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.project}-${var.env}-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = var.ecs_task_execution_role_arn
  task_role_arn            = var.ecs_task_role_arn
  container_definitions = jsonencode([{
    name      = "backend"
    image     = "${var.ecr_repository_url}:latest"
    essential = true
    portMappings = [{
      containerPort = 5000
      hostPort      = 5000
      protocol      = "tcp"
    }]
    environment = [
      { name = "NODE_ENV", value = "production" },
      { name = "PORT", value = "5000" },
      { name = "CLIENT_URL", value = var.client_url },
      { name = "CORS_ORIGIN", value = var.client_url },
    ]
    secrets = [
      { name = "MONGODB_URI", valueFrom = "arn:aws:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:${var.project}/${var.env}/mongodb-uri:" },
      { name = "JWT_SECRET", valueFrom = "arn:aws:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:${var.project}/${var.env}/jwt-secret:" },
      { name = "JWT_REFRESH_SECRET", valueFrom = "arn:aws:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:${var.project}/${var.env}/jwt-refresh-secret:" },
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.backend.name
        "awslogs-region"        = data.aws_region.current.name
        "awslogs-stream-prefix" = "backend"
      }
    }
    healthCheck = {
      command     = ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 10
    }
  }])
  tags = var.tags
}

resource "aws_security_group" "ecs_tasks" {
  name        = "${var.project}-${var.env}-ecs-tasks-sg"
  description = "ECS Tasks Security Group"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5000
    to_port         = 5000
    protocol        = "tcp"
    security_groups = [var.alb_security_group_id]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = merge(var.tags, { Name = "${var.project}-${var.env}-ecs-tasks-sg" })
}

resource "aws_ecs_service" "backend" {
  name            = "${var.project}-${var.env}-backend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }
  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = "backend"
    container_port   = 5000
  }
  depends_on = [var.target_group_arn]
  tags       = var.tags
}

data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

output "cluster_name" { value = aws_ecs_cluster.main.name }
output "service_name" { value = aws_ecs_service.backend.name }

# VPC Module
module "vpc" {
  source = "./modules/vpc"
  project = var.project
  env     = var.environment
  vpc_cidr = var.vpc_cidr
  tags    = local.common_tags
}

# ECR Module
module "ecr" {
  source = "./modules/ecr"
  project = var.project
  env     = var.environment
  tags    = local.common_tags
}

# IAM Module
module "iam" {
  source = "./modules/iam"
  project = var.project
  env     = var.environment
  tags    = local.common_tags
}

# ALB Module
module "alb" {
  source = "./modules/alb"
  project = var.project
  env     = var.environment
  vpc_id  = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
  tags    = local.common_tags
}

# ECS Module
module "ecs" {
  source = "./modules/ecs"
  project = var.project
  env     = var.environment
  vpc_id  = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  alb_security_group_id = module.alb.alb_security_group_id
  target_group_arn = module.alb.backend_target_group_arn
  ecs_task_execution_role_arn = module.iam.ecs_task_execution_role_arn
  ecs_task_role_arn = module.iam.ecs_task_role_arn
  ecr_repository_url = var.ecr_repository_url != "" ? var.ecr_repository_url : module.ecr.repository_url
  db_password    = var.db_password
  jwt_secret     = var.jwt_secret
  jwt_refresh_secret = var.jwt_refresh_secret
  client_url     = "https://${module.alb.dns_name}"
  tags    = local.common_tags
}

# Secrets Manager
module "secrets" {
  source = "./modules/secrets"
  project = var.project
  env     = var.environment
  db_password      = var.db_password
  jwt_secret       = var.jwt_secret
  jwt_refresh_secret = var.jwt_refresh_secret
  tags    = local.common_tags
}

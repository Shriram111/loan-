terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  project = "saarthi-bank"
  env     = var.environment
  common_tags = {
    Project     = local.project
    Environment = local.env
    ManagedBy   = "terraform"
  }
}

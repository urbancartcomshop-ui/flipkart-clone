variable "aws_region" {
  description = "AWS region to deploy to"
  type        = string
  default     = "af-south-1"
}

variable "project_name" {
  description = "Project name prefix"
  type        = string
  default     = "flipkart"
}

variable "desired_count" {
  description = "Desired number of ECS tasks"
  type        = number
  default     = 1
}

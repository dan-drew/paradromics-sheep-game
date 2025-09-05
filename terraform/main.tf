provider "aws" {
  region = "us-west-2"
  default_tags {
    tags = {
      app =local.app_name
    }
  }
}

provider "aws" {
  alias  = "east"
  region = "us-east-1"

  default_tags {
    tags = {
      app = local.app_name
    }
  }
}

terraform {
  required_version = ">= 1.9"
}

locals {
  app_name = "sheep-game"
}

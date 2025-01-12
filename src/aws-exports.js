const awsconfig = {
      "aws_project_region": "us-east-1",
      "aws_cognito_identity_pool_id": "us-east-1:526519a4-66b4-4c39-ad4e-9ac0d807e238",
      "aws_cognito_region": "us-east-1",
      "aws_user_pools_id": "us-east-1_sFnJdw6yV",
      "aws_user_pools_web_client_id": "7ig7bes55tm1n27282flnd1rfn",
      "oauth": {},
      "aws_cognito_username_attributes": [
        "email",
        "phone_number"
      ],
      "aws_cognito_social_providers": [],
      "aws_cognito_signup_attributes": [
        "email",
        "phone_number"
      ],
      "aws_cognito_mfa_configuration": "OFF",
      "aws_cognito_mfa_types": [
        "SMS"
      ],
      "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": [
          "REQUIRES_LOWERCASE",
          "REQUIRES_UPPERCASE",
          "REQUIRES_NUMBERS",
          "REQUIRES_SYMBOLS"
        ]
      },
      "aws_cognito_verification_mechanisms": [
        "EMAIL"
      ],
      "aws_user_files_s3_bucket": "pharmacy-app-customer-prescriptions",
      "aws_user_files_s3_bucket_region": "us-east-1"
    };

    export default awsconfig;

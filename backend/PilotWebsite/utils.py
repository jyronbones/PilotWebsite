import boto3
from botocore.exceptions import ClientError
import json
import os

def get_secret():
    secret_name = "prod/pilotwebsite/agreementfileskeys"
    region_name =os.getenv('AWS_S3_REGION_NAME')

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        print(f"Unable to retrieve secret {secret_name}: {e}")
        raise e

    # Assuming the secret is stored in the string format within Secrets Manager
    secret = get_secret_value_response['SecretString']
    secrets_dict = json.loads(secret)

    AWS_ACCESS_KEY_ID = secrets_dict.get('AWS_ACCESS_KEY_ID', '')
    AWS_SECRET_ACCESS_KEY = secrets_dict.get('AWS_SECRET_ACCESS_KEY', '')
    AWS_STORAGE_BUCKET_NAME = secrets_dict.get('AWS_STORAGE_BUCKET_NAME', '')
    AWS_S3_REGION_NAME = secrets_dict.get('AWS_S3_REGION_NAME', '')

    return AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_STORAGE_BUCKET_NAME, AWS_S3_REGION_NAME
# Example usage
if __name__ == "__main__":
    access_key, secret_key, bucket_name, region = get_secret()
    print(f"Access Key: {access_key}")
    print(f"Secret Key: {secret_key}")
    print(f"Bucket Name: {bucket_name}")
    print(f"Region: {region}")
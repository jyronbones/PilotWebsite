import boto3
from botocore.exceptions import ClientError
import json

def get_secret():

    # secret_name = "dev/pilotwebsite/agreementfiles"
    # region_name = "ca-central-1"

    secret_name = "prod/pilotwebsite/agreementfileskeys"
    region_name = "us-east-1"

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
        # For a list of exceptions thrown, see
        # https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        raise e

    secret = get_secret_value_response['SecretString']
    secrets_dict = json.loads(secret)

    AWS_ACCESS_KEY_ID = secrets_dict.get('AWS_ACCESS_KEY_ID', '')
    AWS_SECRET_ACCESS_KEY = secrets_dict.get('AWS_SECRET_ACCESS_KEY', '')
    AWS_STORAGE_BUCKET_NAME = secrets_dict.get('AWS_STORAGE_BUCKET_NAME', '')
    AWS_S3_REGION_NAME = secrets_dict.get('AWS_S3_REGION_NAME', '')

    return AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_STORAGE_BUCKET_NAME, AWS_S3_REGION_NAME

import boto3
import json
from botocore.exceptions import ClientError, NoCredentialsError, PartialCredentialsError

def fetch_secrets_dict_from_aws(secret_name, region_name):
    """
    Fetches the entire secret dictionary from AWS Secrets Manager
    """
    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)
    
    try:
        response = client.get_secret_value(SecretId=secret_name)
        secret_dict = json.loads(response['SecretString'])
        return secret_dict
    except ClientError as e:
        # For a list of exceptions thrown, see
        # https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        raise e
    except (NoCredentialsError, PartialCredentialsError) as e:
        raise Exception(f"Credentials error fetching secret: {e}")
    except Exception as e:
        raise Exception(f"Error fetching secret: {e}")

def get_aws_secret(secret_name, secret_key, region_name):
    """
    Fetches a specific key's value from the specified secret in AWS Secrets Manager
    """
    secret_dict = fetch_secrets_dict_from_aws(secret_name, region_name)
    return secret_dict.get(secret_key, '')

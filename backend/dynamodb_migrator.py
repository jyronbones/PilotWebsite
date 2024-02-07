import boto3
from botocore.exceptions import ClientError
from PilotWebsite.settings import DB_ENDPOINT, DB_TABLE
import os
from dotenv import load_dotenv
load_dotenv()


dynamodb = boto3.resource(
    "dynamodb",
    endpoint_url=os.getenv("DB_ENDPOINT"),
    region_name=os.getenv("DB_REGION_NAME"),
    aws_access_key_id=os.getenv("DB_AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("DB_AWS_SECRET_ACCESS_KEY"),
)


def create_users_table(dynamodb=dynamodb):
    try:
        table = dynamodb.create_table(
            TableName=DB_TABLE,
            KeySchema=[{"AttributeName": "id", "KeyType": "HASH"}],
            AttributeDefinitions=[
                {"AttributeName": "id", "AttributeType": "S"},
            ],
            ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 2},
        )
        table.meta.client.get_waiter("table_exists").wait(TableName=DB_TABLE)
        print(
            f"{DB_TABLE} table created successfully. Table status:", table.table_status
        )
        print("Item count:", table.item_count)

    except ClientError as e:
        if e.response["Error"]["Code"] == "ResourceInUseException":
            print(f"Table {DB_TABLE} already exists.")
        else:
            print("An error occurred:", e)


def create_outstandingtoken_table(dynamodb=dynamodb):
    try:
        table = dynamodb.create_table(
            TableName="token_blacklist_outstanding",
            KeySchema=[{"AttributeName": "id", "KeyType": "HASH"}],
            AttributeDefinitions=[
                {"AttributeName": "id", "AttributeType": "S"},
            ],
            ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 2},
        )
        table.meta.client.get_waiter("table_exists").wait(
            TableName="token_blacklist_outstanding"
        )
        print(
            "token_blacklist_outstanding Table created successfully. Table status:",
            table.table_status,
        )
        print("Item count:", table.item_count)

    except ClientError as e:
        if e.response["Error"]["Code"] == "ResourceInUseException":
            print(f"Table token_blacklist_outstanding already exists.")
        else:
            print("An error occurred:", e)


if __name__ == "__main__":
    create_users_table()
    create_outstandingtoken_table()

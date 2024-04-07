import boto3
from botocore.exceptions import ClientError
from PilotWebsite.settings import DB_ENDPOINT, DB_TABLE, DB_EMPLOYEES_TABLE_NAME, DB_USERTRIP_TABLE, DB_PROD_TABLE, DB_AVAILABILITY
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

def create_usertrip_table(dynamodb=dynamodb):
    try:
        table = dynamodb.create_table(
            TableName=DB_USERTRIP_TABLE,
            KeySchema=[{"AttributeName": "trip_id", "KeyType": "HASH"},
                       {"AttributeName": "user_id", "KeyType": "RANGE"}],
            AttributeDefinitions=[
                {"AttributeName": "trip_id", "AttributeType": "S"},
                {"AttributeName": "user_id", "AttributeType": "S"},
            ],
            ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 2},
        )
        table.meta.client.get_waiter("table_exists").wait(
            TableName="token_blacklist_outstanding"
        )
        print(
            "usertrips Table created successfully. Table status:",
            table.table_status,
        )
        print("Item count:", table.item_count)

    except ClientError as e:
        if e.response["Error"]["Code"] == "ResourceInUseException":
            print(f"Table usertrips already exists.")
        else:
            print("An error occurred:", e)

def create_productivity_table(dynamodb=dynamodb):
    try:
        table = dynamodb.create_table(
            TableName=DB_PROD_TABLE,
            KeySchema=[{"AttributeName": "user_id", "KeyType": "HASH"}],
            AttributeDefinitions=[{"AttributeName": "user_id", "AttributeType": "S"}],
            ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 2},
        )
        table.meta.client.get_waiter("table_exists").wait(
            TableName="token_blacklist_outstanding"
        )
        print(
            "productivity Table created successfully. Table status:",
            table.table_status,
        )
        print("Item count:", table.item_count)

    except ClientError as e:
        if e.response["Error"]["Code"] == "ResourceInUseException":
            print(f"Table productivity already exists.")
        else:
            print("An error occurred:", e)

def create_availability_table(dynamodb=dynamodb):
    try:
        table = dynamodb.create_table(
            TableName=DB_AVAILABILITY,
            KeySchema=[{"AttributeName": "id", "KeyType": "HASH"},
                       {"AttributeName": "user_id", "KeyType": "RANGE"}],
            AttributeDefinitions=[
                {"AttributeName": "id", "AttributeType": "S"},
                {"AttributeName": "user_id", "AttributeType": "S"},
            ],
            ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 2},
        )
        table.meta.client.get_waiter("table_exists").wait(
            TableName="token_blacklist_outstanding"
        )
        print(
            "availability Table created successfully. Table status:",
            table.table_status,
        )
        print("Item count:", table.item_count)

    except ClientError as e:
        if e.response["Error"]["Code"] == "ResourceInUseException":
            print(f"Table availability already exists.")
        else:
            print("An error occurred:", e)


def create_employees_table(dynamodb=dynamodb):
    try:
        table = dynamodb.create_table(
            TableName=DB_EMPLOYEES_TABLE_NAME,
            KeySchema=[
                {"AttributeName": "employee_id", "KeyType": "HASH"}  # Partition key
            ],
            AttributeDefinitions=[
                {"AttributeName": "employee_id", "AttributeType": "S"},  # Attribute type is string (S)
            ],
            ProvisionedThroughput={
                "ReadCapacityUnits": 5,
                "WriteCapacityUnits": 5
            }
        )
        table.meta.client.get_waiter('table_exists').wait(TableName=DB_EMPLOYEES_TABLE_NAME)
        print(f"Table {DB_EMPLOYEES_TABLE_NAME} created successfully. Table status:",
            table.table_status,
        )
        print("Item count:", table.item_count)

    except ClientError as e:
        if e.response['Error']['Code'] == "ResourceInUseException":
            print(f"Table {DB_EMPLOYEES_TABLE_NAME} already exists.")
        else:
            print("An error occurred:", e)


if __name__ == "__main__":
    create_users_table()
    create_outstandingtoken_table()
    create_employees_table()
    create_usertrip_table()
    create_productivity_table()
    create_availability_table()

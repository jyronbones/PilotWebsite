import boto3
import os
from botocore.exceptions import ClientError

# Load environment variables
endpoint_url = os.getenv("DB_ENDPOINT")
region_name = os.getenv("DB_REGION_NAME")
aws_access_key_id = os.getenv("DB_AWS_ACCESS_KEY_ID")
aws_secret_access_key = os.getenv("DB_AWS_SECRET_ACCESS_KEY")
db_users_table_name = os.getenv("DB_TABLE")
db_employees_table_name = os.getenv("DB_EMPLOYEES_TABLE_NAME")

def get_dynamodb_resource():
    return boto3.resource(
        'dynamodb',
        endpoint_url=endpoint_url,
        region_name=region_name,
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key,
    )

def sync_user_to_employee(user_id):
    dynamodb = get_dynamodb_resource()
    users_table = dynamodb.Table(db_users_table_name)
    employees_table = dynamodb.Table(db_employees_table_name)

    try:
        # Fetch the user's details from the users table
        user_response = users_table.get_item(Key={'id': user_id})
        user_item = user_response.get('Item', {})
        full_name = user_item.get('full_name', 'Unknown')  # Default to 'Unknown' if not found
        
        # Prepare the data for DynamoDB
        employee_data = {
            'employee_id': user_id,
            'name': full_name,
            # Add other fields as necessary
        }
        
        # Insert or update the employee in the Employees table
        response = employees_table.put_item(Item=employee_data)

        # Check if the operation was successful
        if response['ResponseMetadata']['HTTPStatusCode'] == 200:
            print(f"Synchronized user {full_name} to DynamoDB successfully.")
        else:
            print(f"Failed to synchronize user {full_name} to DynamoDB.")

    except ClientError as e:
        print(f"Failed to sync user {user_id} to DynamoDB: {e.response['Error']['Message']}")


def get_user_instance_from_dynamodb(user_id):
    dynamodb = get_dynamodb_resource()
    users_table = dynamodb.Table(os.getenv("DB_TABLE"))

    try:
        response = users_table.get_item(Key={'id': str(user_id)})
        user_instance = response.get('Item', None)
        if not user_instance:
            print(f"No user found with ID: {user_id}")
            return None
        return user_instance
    except ClientError as e:
        print(f"Failed to fetch user {user_id} from DynamoDB: {e.response['Error']['Message']}")
        return None


def delete_employee_from_dynamodb(user_id):
    dynamodb = get_dynamodb_resource()
    employees_table = dynamodb.Table(db_employees_table_name)

    try:
        # Delete the employee from the Employees table
        response = employees_table.delete_item(Key={'employee_id': str(user_id)})
        print(f"Deleted user {user_id} from Employees table successfully.")
    except ClientError as e:
        print(f"Failed to delete user {user_id} from Employees table: {e.response['Error']['Message']}")

if __name__ == "__main__":
    user_id = input("Enter User ID to sync or delete: ")
    action = input("Do you want to sync or delete? (sync/delete): ")
    if action == "sync":
        user_instance = get_user_instance_from_dynamodb(user_id)  # Fetch user instance
        if user_instance:
            # Now user_instance contains user details
            full_name = user_instance.get('full_name', 'Unknown')  # Extract needed info
            # Call sync with user_id and full_name or modify the function to accept user_instance directly
            sync_user_to_employee(user_id, full_name)  # Modify function signature accordingly
    elif action == "delete":
        delete_employee_from_dynamodb(user_id)


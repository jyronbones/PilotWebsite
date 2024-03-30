import uuid
from datetime import datetime
from dynamorm import DynaModel
from marshmallow import fields
import os
from dotenv import load_dotenv

load_dotenv()

DB_TABLE = os.getenv("DB_TABLE")
endpoint_url = os.getenv("DB_ENDPOINT")
region_name = os.getenv("DB_REGION_NAME")
aws_access_key_id = os.getenv("DB_AWS_ACCESS_KEY_ID")
aws_secret_access_key = os.getenv("DB_AWS_SECRET_ACCESS_KEY")


# This is User model for users
class UserNew(DynaModel):
    class Table:
        resource_kwargs = {
            "endpoint_url": endpoint_url,
            "region_name": region_name,
            "aws_access_key_id": aws_access_key_id,
            "aws_secret_access_key": aws_secret_access_key
        }
        name = DB_TABLE
        hash_key = "id"
        read = 25
        write = 5

    class Schema:
        id = fields.UUID(required=True)
        full_name = fields.String()
        first_name = fields.String()
        last_name = fields.String()
        email = fields.String(required=True)
        user_type = fields.Integer(required=True)
        password = fields.String(required=True)
        date_joined = fields.DateTime(format="iso")
        created_at = fields.DateTime(format="iso")
        updated_at = fields.DateTime(format="iso")
        is_superuser = fields.Boolean(required=True)
        is_staff = fields.Boolean(required=True)
        is_active = fields.Boolean(required=True)
        is_authenticated = fields.Boolean(required=True, default=True)
        last_login = fields.DateTime(allow_none=True, format="iso")

# Check the user email in DynamoDB if it's exist or not
def check_user(email):
    user = list(UserNew.scan(email=email))
    if user:
        return True
    else:
        return False

def create_admin_account(full_name, email):
    try:
        timestamp = datetime.now().isoformat()
        user_id = str(uuid.uuid4())
        full_name = full_name
        first_name = ""
        last_name = ""
        email = email
        user_type = 1
        password = "test"
        date_joined = timestamp
        created_at = timestamp
        updated_at = timestamp
        is_superuser = True
        is_staff = True
        is_active = True
        is_authenticated = True
        last_login = None


        # Retrun a fail msg if the user is already exist in the DB
        user_exist = check_user(email)
        if user_exist:
            return{
                    "success": False,
                    "message": f"User with the {email} email is already exist!",
            }

        # New user data to be saved on database:
        record = UserNew(
            id=user_id,
            full_name=full_name,
            first_name=first_name,
            last_name=last_name,
            email=email,
            user_type=user_type,
            password=password,
            date_joined=date_joined,
            created_at=created_at,
            updated_at=updated_at,
            is_superuser=is_superuser,
            is_staff=is_staff,
            is_active=is_active,
            is_authenticated=is_authenticated,
            last_login=last_login,
        )
        # Save the data gathered for new user on DynamoDB
        record.save()
        return {"success": True, "message": "User created successfully"},
            
    except Exception as e:
        return {"success": False, "message": f"Bad request: {str(e)}"},


full_name = input("Enter your full name please: ")

email = input("Your Admin Email address please: ")

password = input("Enter your password: ")


results = create_admin_account(full_name, email)
print(results)

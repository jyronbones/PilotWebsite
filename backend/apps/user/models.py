from dynamorm import DynaModel
from django.conf import settings
from marshmallow import fields
import os
from dotenv import load_dotenv

load_dotenv()

endpoint_url = os.getenv("DB_ENDPOINT")
region_name = os.getenv("DB_REGION_NAME")
aws_access_key_id = os.getenv("DB_AWS_ACCESS_KEY_ID")
aws_secret_access_key = os.getenv("DB_AWS_SECRET_ACCESS_KEY")


# This is User model for users
class UserNew(DynaModel):
    class Table:
        resource_kwargs = {
            # "endpoint_url": endpoint_url,
            "region_name": region_name,
            "aws_access_key_id": aws_access_key_id,
            "aws_secret_access_key": aws_secret_access_key,
        }
        name = settings.DB_TABLE
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


# This is token model
class outstandingToken(DynaModel):
    class Table:
        resource_kwargs = {
            # "endpoint_url": endpoint_url,
            "region_name": region_name,
            "aws_access_key_id": aws_access_key_id,
            "aws_secret_access_key": aws_secret_access_key,
        }
        name = "token_blacklist_outstanding"
        hash_key = "id"
        read = 25
        write = 5

    class Schema:
        id = fields.UUID(required=True)
        token_type = fields.String(required=True)
        token = fields.String(required=True)
        created_at = fields.DateTime(format="iso", required=True)
        expires_at = fields.DateTime(format="iso", required=True)
        user_id = fields.UUID(required=True)
        is_authenticated = fields.Boolean(required=True, default=True)
        jti = fields.String(required=True)

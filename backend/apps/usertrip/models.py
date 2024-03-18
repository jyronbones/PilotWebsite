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
class UserTrip(DynaModel):
    class Table:
        resource_kwargs = {
            # "endpoint_url": endpoint_url,
            "region_name": region_name,
            "aws_access_key_id": aws_access_key_id,
            "aws_secret_access_key": aws_secret_access_key,
        }
        name = settings.DB_USERTRIP_TABLE
        hash_key = "trip_id"
        sort_key = "user_id"
        read = 25
        write = 5

    class Schema:
        trip_id = fields.UUID(required=True)
        user_id = fields.UUID(required=True)
        vessel = fields.String(required=True)
        date = fields.Date(required=True)
        departure = fields.Integer(required=True)
        destination = fields.Integer(required=True)
        trip_type = fields.Integer(required=True)
        double = fields.Boolean(required=True)
        notes = fields.String()
        updated_at = fields.DateTime(format="iso")


# This is productivity model
class Productivity(DynaModel):
    class Table:
        resource_kwargs = {
            "endpoint_url": endpoint_url,
            "region_name": region_name,
            "aws_access_key_id": aws_access_key_id,
            "aws_secret_access_key": aws_secret_access_key,
        }
        name = "token_blacklist_outstanding"
        hash_key = "id"
        sort_key = "user_id"
        read = 25
        write = 5

    class Schema:
        id = fields.UUID(required=True)
        user_id = fields.UUID(required=True)
        total_full = fields.String(required=True)
        total_partial = fields.String(required=True)
        total_cancel = fields.DateTime(format="iso", required=True)
        total_double = fields.DateTime(format="iso", required=True)
        total_assignments = fields.UUID(required=True)
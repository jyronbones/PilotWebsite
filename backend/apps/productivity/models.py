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

# This is productivity model
class Productivity(DynaModel):
    class Table:
        resource_kwargs = {
            # "endpoint_url": endpoint_url,
            "region_name": region_name,
            "aws_access_key_id": aws_access_key_id,
            "aws_secret_access_key": aws_secret_access_key,
        }
        name = settings.DB_PROD_TABLE
        hash_key = "user_id"
        read = 25
        write = 5

    class Schema:
        user_id = fields.UUID(required=True)
        auth_corp = fields.Decimal()
        total_full = fields.Integer(required=True)
        total_partial = fields.Integer(required=True)
        total_cancel = fields.Integer(required=True)
        total_double = fields.Integer(required=True)
        total_assignments = fields.Integer(required=True)
        total = fields.Decimal()
        year = fields.String()
        daily_rate = fields.Integer()
        monthly_rate = fields.Integer()


class ProductivitySupport(DynaModel):
    class Table:
        resource_kwargs = {
            # "endpoint_url": endpoint_url,
            "region_name": region_name,
            "aws_access_key_id": aws_access_key_id,
            "aws_secret_access_key": aws_secret_access_key,
        }
        name = settings.DB_PROD_TABLE
        hash_key = "id"
        read = 25
        write = 5

    class Schema:
        id = fields.UUID(required=True)
        year = fields.Integer()
        shared_value = fields.Decimal()
        daily_rate = fields.Integer()
        monthly_rate = fields.Integer()

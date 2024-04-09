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
class Availability(DynaModel):
    class Table:
        resource_kwargs = {
            # "endpoint_url": endpoint_url,
            "region_name": region_name,
            "aws_access_key_id": aws_access_key_id,
            "aws_secret_access_key": aws_secret_access_key,
        }
        name = settings.DB_AVAILABILITY
        hash_key = "id"
        range_key = "user_id"
        read = 25
        write = 5

    class Schema:
        id = fields.UUID(required=True)
        user_id = fields.UUID(required=True)
        year = fields.String()
        apr = fields.Boolean(required=True)
        may = fields.Boolean(required=True)
        jun= fields.Boolean(required=True)
        jul = fields.Boolean(required=True)
        aug = fields.Boolean(required=True)
        sep = fields.Boolean(required=True)
        oct = fields.Boolean(required=True)
        nov = fields.Boolean(required=True)
        dec = fields.Boolean(required=True)
        total_effective = fields.Integer()

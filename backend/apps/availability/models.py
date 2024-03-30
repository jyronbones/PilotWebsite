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
            "endpoint_url": endpoint_url,
            "region_name": region_name,
            "aws_access_key_id": aws_access_key_id,
            "aws_secret_access_key": aws_secret_access_key,
        }
        name = settings.DB_AVAILABILITY
        hash_key = "user_id"
        read = 25
        write = 5

    class Schema:
        user_id = fields.UUID(required=True)
        apr = fields.Integer(required=True)
        may = fields.Integer(required=True)
        jun= fields.Integer(required=True)
        july = fields.Integer(required=True)
        aug = fields.Integer(required=True)
        sep = fields.Integer(required=True)
        oct = fields.Integer(required=True)
        nov = fields.Integer(required=True)
        dec = fields.Integer(required=True)

from dynamorm import DynaModel
from marshmallow import fields, Schema
from django.conf import settings
import os
from dotenv import load_dotenv

load_dotenv()
# DynamoDB connection settings
endpoint_url = os.getenv("DB_ENDPOINT")
region_name = os.getenv("DB_REGION_NAME")
aws_access_key_id = os.getenv("DB_AWS_ACCESS_KEY_ID")
aws_secret_access_key = os.getenv("DB_AWS_SECRET_ACCESS_KEY")
employees_table = os.getenv("DB_EMPLOYEES_TABLE_NAME")

# Defines the structure for an event
class EventSchema(Schema):
    event_id = fields.String(required=True)  # Unique identifier for the event
    startDate = fields.DateTime(required=True, format='%Y-%m-%d')
    endDate = fields.DateTime(required=True, format='%Y-%m-%d')
    eventType = fields.String(required=False)  # 'work' or 'vacation'


# Employee model for the scheduling app
class Employee(DynaModel):
    class Table:
        resource_kwargs = {
            "endpoint_url": endpoint_url, # this is used for localhost
            "region_name": region_name,
            "aws_access_key_id": aws_access_key_id,
            "aws_secret_access_key": aws_secret_access_key,
        }
        name = employees_table  # The name of your DynamoDB table
        hash_key = "employee_id"  # Primary key
        read = 5  # Read capacity
        write = 5  # Write capacity

    class Schema:
        employee_id = fields.String(required=True)  # Unique identifier for the employee
        name = fields.String(required=True)  # Name of the employee
        events = fields.List(fields.Nested(EventSchema()), required=False)  # List of events


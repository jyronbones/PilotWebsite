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

# Defines the structure for an event
class EventSchema(Schema):
    startDate = fields.DateTime(required=True, format='%Y-%m-%d %H:%M:%S')
    endDate = fields.DateTime(required=True, format='%Y-%m-%d %H:%M:%S')
    eventType = fields.String(required=True)  # 'work' or 'vacation'


# Employee model for the scheduling app
class Employee(DynaModel):
    class Table:
        resource_kwargs = {
            "endpoint_url": endpoint_url, # this is used for localhost
            "region_name": region_name,
            "aws_access_key_id": aws_access_key_id,
            "aws_secret_access_key": aws_secret_access_key,
        }
        name = "Employees"  # The name of your DynamoDB table
        # name = settings.DB_TABLE # alternative DynamoDB table access
        hash_key = "employee_id"  # Primary key
        read = 5  # Read capacity
        write = 5  # Write capacity

    class Schema:
        employee_id = fields.String(required=True)  # Unique identifier for the employee
        name = fields.String(required=True)  # Name of the employee
        events = fields.List(fields.Nested(EventSchema()), required=False)  # List of events
        # schedules = fields.List(fields.Nested(ScheduleSchema()))
        # vacations = fields.List(fields.Nested(VacationSchema()))


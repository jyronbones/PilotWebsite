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

class ScheduleSchema(Schema):
    startDate = fields.Date(required=True, format='%Y-%m-%d')
    endDate = fields.Date(required=True, format='%Y-%m-%d')

class VacationSchema(Schema):
    startDate = fields.Date(required=True)
    endDate = fields.Date(required=True)

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
        read = 25  # Read capacity
        write = 5  # Write capacity

    class Schema:
        employee_id = fields.String(required=True)  # Unique identifier for the employee
        name = fields.String(required=True)  # Name of the employee
        schedules = fields.List(fields.Nested(ScheduleSchema()))
        vacations = fields.List(fields.Nested(VacationSchema()))


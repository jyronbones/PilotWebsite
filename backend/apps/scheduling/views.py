from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from PilotWebsite.settings import DB_ENDPOINT, DB_TABLE
from decimal import Decimal
import boto3
import json
import os

# # DynamoDB Solution:
dynamodb = boto3.resource(
    "dynamodb",
    endpoint_url=os.getenv("DB_ENDPOINT"), # this is used for localhost
    region_name=os.getenv("DB_REGION_NAME"),
    aws_access_key_id=os.getenv("DB_AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("DB_AWS_SECRET_ACCESS_KEY"),
)


table = dynamodb.Table('Employees')

@api_view(['GET'])
def get_employee(request, employee_id):
    try:
        response = table.get_item(Key={'employee_id': employee_id})
        employee = response.get('Item')

        if employee:
            return Response(employee)
        else:
            return Response({'error': 'Employee not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    

@api_view(['GET'])
def events_list(request):
    # Your logic here
    return Response({'message': 'This is the events list.'})


@api_view(['GET'])
def employees_list(request):

    try:
        # Scan the table (Note: Consider using query or scan with pagination in production)
        response = table.scan()
        employees = response.get('Items', [])

        # Check if employees exist
        if employees:
            return Response(employees)
        else:
            return Response({'message': 'No employees found'}, status=404)
    except Exception as e:
        # Log the error and return an appropriate message
        print(f"Error fetching employees: {str(e)}")
        return Response({'error': 'Error fetching employees list'}, status=500)


# Adding Employees to the Calendar
@api_view(['POST'])
def add_employee(request):
    if request.method == "POST":
        try: 
            data = request.data
            employee_id = data.get('employee_id')
            name = data.get('name')

            # Check if the employee already exists
            existing_employee = table.get_item(Key={'employee_id': employee_id})
            if 'Item' in existing_employee:
                # Employee already exists, don't overwrite it
                return Response({'error': 'Employee with this ID already exists.'}, status=400)

            # Proceed to add the employee since it doesn't exist
            response = table.put_item(
                Item={
                    'employee_id': employee_id,
                    'name': name,
                }
            )

            return Response({'message': 'Employee added successfully', 'response': response})
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    else:
        # This else block is technically unnecessary because @api_view(['POST']) already restricts to POST requests
        return Response({'error': 'Invalid HTTP method'}, status=405)
    

    # Fetch or get all Employees from DynamoDB
def get_all_Employees():
    # Fetch all Employees:
    result = table.scan()
    employee_count = result["Count"]
    result = result["Items"]
    # Convert decimal values in employee list into integers
    for item in result:
        for key, value in item.items():
            if isinstance(value, Decimal):
                item[key] = int(value)
    return {"all": result, "count": employee_count}

@api_view(['DELETE'])
def delete_employee(request, employee_id):
    try:
        # Attempt to delete the employee with the provided ID
        response = table.delete_item(Key={'employee_id': employee_id})

        # Check for the status of the operation in the response
        if response.get('ResponseMetadata', {}).get('HTTPStatusCode') == 200:
            return Response({'message': 'Employee deleted successfully'})
        else:
            return Response({'error': 'Failed to delete employee'}, status=500)

    except Exception as e:
        return Response({'error': str(e)}, status=500)
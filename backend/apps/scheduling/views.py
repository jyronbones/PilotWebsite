from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from PilotWebsite.settings import DB_ENDPOINT, DB_TABLE
from decimal import Decimal
from .models import Employee
from datetime import datetime
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

# table = dynamodb.Table('Employees')
table_name=os.getenv("DB_EMPLOYEES_TABLE_NAME")
table = dynamodb.Table("Employees")  # Correct table initialization


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def employee_events(request, employee_id=None):
    """
    The GET method fetches and returns the events for a specific employee.
    The POST method adds a new event to the employee's events list.
    The PUT method updates a specific event in the list based on an id provided in event_data.
    The DELETE method removes a specific event from the list, also based on an id.
    """
    if request.method == 'GET':
        # Fetch and return employee's events
        response = table.get_item(Key={'employee_id': employee_id})
        employee = response.get('Item')
        if employee:
            return Response(employee.get('events', []), status=200)
        return Response({'error': 'Employee not found'}, status=404)

    # For POST, PUT, DELETE
    event_data = request.data.get('event')
    try:
        response = table.get_item(Key={'employee_id': employee_id})
        employee = response.get('Item')
        if not employee:
            return Response({'error': 'Employee not found'}, status=404)
        
        if 'events' not in employee:
            employee['events'] = []

        if request.method == 'POST':
            # Append new event
            employee['events'].append(event_data)
        
        elif request.method == 'PUT':
            # Find and update the specific event
            event_id = event_data.get('id')
            for i, event in enumerate(employee['events']):
                if event.get('id') == event_id:
                    employee['events'][i] = event_data
                    break
        
        elif request.method == 'DELETE':
            # Remove the specified event
            employee['events'] = [event for event in employee['events'] if event.get('id') != event_data.get('id')]

        # Update DynamoDB record
        table.update_item(
            Key={'employee_id': employee_id},
            UpdateExpression='SET events = :e',
            ExpressionAttributeValues={':e': employee['events']},
        )
        return Response({'message': 'Employee events updated successfully'}, status=200)
    
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def update_employee_events(request, employee_id):
    # Assuming the request body contains an event object with necessary event details
    event_data = request.data.get('event')
    operation = request.data.get('operation')
    try:
        # Fetch the employee's current data from DynamoDB
        response = table.get_item(Key={'employee_id': employee_id})
        employee = response.get('Item')

        if not employee:
            return Response({'error': 'Employee not found'}, status=404)
        
        # Initialize events list if not present
        if 'events' not in employee:
            employee['events'] = []

        if operation == 'add':
            # Append the new event to the list
            employee['events'].append(event_data)

        elif operation == 'update':
            # Assuming each event has a unique identifier within 'event_id' and it's included in event_data
            for index, event in enumerate(employee['events']):
                if event.get('event_id') == event_data.get('event_id'):
                    employee['events'][index] = event_data  # Update the event with new data
                    break

        elif operation == 'delete':
            # Remove the event with the given 'event_id'
            employee['events'] = [event for event in employee['events'] if event.get('event_id') != event_data.get('event_id')]

        # Update the employee record with the new event list
        table.update_item(
            Key={'employee_id': employee_id},
            UpdateExpression='SET events = :val',
            ExpressionAttributeValues={
                ':val': employee['events']
            }
        )

        return Response({'message': 'Employee events updated successfully'})
    except Exception as e:
        return Response({'error': str(e)}, status=500)


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
            events = data.get('events', [])

            # Check if the employee already exists
            existing_employee = table.get_item(Key={'employee_id': employee_id})
            if 'Item' in existing_employee:
                # Employee already exists, don't overwrite it
                return Response({'error': 'Employee with this ID already exists.'}, status=400)

            # Proceed to add the employee since it doesn't exist
            employee_data = table.put_item(
                Item={
                    'employee_id': employee_id,
                    'name': name,
                    'schedules': events,
                }
            )
            response = table.put_item(Item=employee_data)

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
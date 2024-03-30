from django.utils.dateparse import parse_date
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from PilotWebsite.settings import DB_ENDPOINT, DB_EMPLOYEES_TABLE_NAME
from decimal import Decimal
from .models import Employee
from datetime import datetime
import boto3
import json
import os

dynamodb = boto3.resource(
    "dynamodb",
    region_name=os.getenv("DB_REGION_NAME"),
    aws_access_key_id=os.getenv("DB_AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("DB_AWS_SECRET_ACCESS_KEY"),
)

table_name=DB_EMPLOYEES_TABLE_NAME
table = dynamodb.Table(DB_EMPLOYEES_TABLE_NAME)


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def employee_events(request, employee_id=None):
    # GET: Fetch employee's events
    if request.method == 'GET':
        try:
            response = table.get_item(Key={'employee_id': employee_id})
            employee = response.get('Item')
            if employee:
                # Return events with converted datetime to date string, if needed
                return Response(employee.get('events', []), status=200)
            else:
                return Response({'error': 'Employee not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    # Handle event data for POST and PUT
    event_data = request.data.get('event', {})
    # Shared logic for POST, PUT, DELETE to fetch employee
    try:
        response = table.get_item(Key={'employee_id': employee_id})
        employee = response.get('Item')
        if not employee:
            return Response({'error': 'Employee not found'}, status=404)

        # Initialize events list if not present
        if 'events' not in employee:
            employee['events'] = []

        if request.method == 'POST':
            new_event_id = f"{employee_id}-{len(employee['events']) + 1}"
            event_data['event_id'] = new_event_id
            # Assuming event_data is already in the correct format and contains all necessary fields
            employee['events'].append(event_data)
            # Update the employee's events in DynamoDB
            response = table.update_item(
                Key={'employee_id': employee_id},
                UpdateExpression='SET events = :e',
                ExpressionAttributeValues={':e': employee['events']}
                )

        elif request.method == 'PUT':
            # Update an existing event
            event_id = event_data.get('event_id')
            for i, event in enumerate(employee['events']):
                if event.get('event_id') == event_id:
                    employee['events'][i] = event_data
                    break

        elif request.method == 'DELETE':
            event_id = request.data.get('event_id')
            # Filter out the event to delete
            updated_events = [event for event in employee['events'] if event.get('event_id') != event_id]
            # Make sure to use updated_events for the update
            table.update_item(
                Key={'employee_id': employee_id},
                UpdateExpression='SET events = :val',
                ExpressionAttributeValues={':val': updated_events}
            )
            return Response({'message': 'Event deleted successfully'}, status=200)
        return Response({'message': 'Employee events updated successfully'}, status=200)

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
        # Scan the table
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

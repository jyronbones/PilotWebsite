from django.core.management.base import BaseCommand
from django.test import Client

class Command(BaseCommand):
    help = 'Test adding, updating, and deleting events for an employee in DynamoDB'

    def add_arguments(self, parser):
        parser.add_argument('employee_id', type=str, help='Employee ID to manipulate events')
        parser.add_argument('action', type=str, choices=['add', 'update', 'delete'], help='Action to perform on the event (add, update, delete)')
        # Add any additional arguments here if needed

    def handle(self, *args, **options):
        employee_id = options['employee_id']
        action = options['action']

        # Example event data, modify according to your schema
        event_data = {
            'event': {
                'event_id': 'exampleEventId',  # for update/delete, ensure this matches an existing event
                'startDate': '2024-04-01T09:00:00',
                'endDate': '2024-04-01T17:00:00',
                'eventType': 'work'
            }
        }

        client = Client()
        if action == 'add':
            response = client.post(f'/api/v1/scheduling/update-employee-events/{employee_id}/', data=event_data, content_type='application/json')
        elif action == 'update':
            response = client.put(f'/api/v1/scheduling/update-employee-events/{employee_id}/', data=event_data, content_type='application/json')
        elif action == 'delete':
            # Assuming deletion might only need the event_id and not the full event object
            response = client.delete(f'/api/v1/scheduling/update-employee-events/{employee_id}/', data={'event_id': event_data['event']['event_id']}, content_type='application/json')

        # Check response and output result
        if response.status_code in [200, 204]:  # Assuming 200 OK or 204 No Content for success
            self.stdout.write(self.style.SUCCESS(f'Successfully {action}ed event for employee ID: {employee_id}'))
        else:
            self.stdout.write(self.style.ERROR(f'Failed to {action} event for employee ID: {employee_id}. Status code: {response.status_code}'))

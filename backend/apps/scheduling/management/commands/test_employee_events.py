from django.core.management.base import BaseCommand
from django.test import Client
import json

class Command(BaseCommand):
    help = 'Test add, update, and delete operations for employee events'

    def add_arguments(self, parser):
        parser.add_argument('employee_id', type=str, help='The ID of the employee whose events are being tested')
        parser.add_argument('action', type=str, choices=['add', 'update', 'delete'], help='The action to test (add, update, delete)')

    def handle(self, *args, **options):
        employee_id = options['employee_id']
        action = options['action']
        client = Client()

        event_data = {
            'add': {
                'event': {
                    'event_id': 'ab2b9cbf-c929-44e1-8bba-e0ed810aeeda-1',
                    'startDate': '2024-01-01',
                    'endDate': '2024-01-01'
                }
            },
            'update': {
                'event': {
                    'event_id': 'ab2b9cbf-c929-44e1-8bba-e0ed810aeeda-2',
                    'startDate': '2024-01-02',  # New start date
                    'endDate': '2024-01-02'
                }
            },
            'delete': {
                'event': {
                    'event_id': 'ab2b9cbf-c929-44e1-8bba-e0ed810aeeda-3'
                }
            }
        }

        if action in ['add', 'update']:
            response = client.post(f'/api/v1/scheduling/employee-events/{employee_id}/', data=json.dumps(event_data[action]), content_type='application/json')
        elif action == 'delete':
            response = client.delete(f'/api/v1/scheduling/employee-events/{employee_id}/', data=json.dumps(event_data[action]), content_type='application/json')

        if response.status_code in [200, 204]:  # Assuming 204 No Content for a successful delete
            self.stdout.write(self.style.SUCCESS(f'Successfully {action}ed event for employee ID: {employee_id}'))
        else:
            self.stdout.write(self.style.ERROR(f'Failed to {action} event for employee ID: {employee_id}. Status code: {response.status_code}'))

from django.core.management.base import BaseCommand
from apps.scheduling.dynamodb_utils import sync_user_to_employee, delete_employee_from_dynamodb

class Command(BaseCommand):
    help = 'Test synchronization and deletion of a user to/from DynamoDB'

    def add_arguments(self, parser):
        parser.add_argument('user_id', type=str, help='User ID to sync or delete')
        parser.add_argument('action', type=str, help='Action to perform on the user (sync or delete)')

    def handle(self, *args, **options):
        user_id = options['user_id']
        action = options['action']

        if action == 'sync':
            self.stdout.write(self.style.SUCCESS(f'Starting sync for user ID: {user_id}'))
            # Assuming sync_user_to_employee now accepts user instance or detailed info
            # You'll need to fetch the user info here if necessary before passing to the function
            sync_user_to_employee(user_id)  # Modify as needed based on actual function signature
            self.stdout.write(self.style.SUCCESS(f'Finished sync for user ID: {user_id}'))
        elif action == 'delete':
            self.stdout.write(self.style.SUCCESS(f'Starting delete for user ID: {user_id}'))
            delete_employee_from_dynamodb(user_id)
            self.stdout.write(self.style.SUCCESS(f'Finished delete for user ID: {user_id}'))
        else:
            self.stdout.write(self.style.ERROR('Invalid action. Use "sync" or "delete".'))

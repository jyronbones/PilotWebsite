from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from apps.user.models import UserNew
from apps.scheduling.dynamodb_utils import sync_user_to_employee, delete_employee_from_dynamodb

# Receiver function to synchronize Django UserNew instance to DynamoDB 'Employees' table upon saving
@receiver(post_save, sender=UserNew)
def usernew_post_save_receiver(sender, instance, created, **kwargs):
    # Extract user_id from instance and convert it to string if necessary
    user_id = str(instance.id)
    # Call the utility function to synchronize the user instance to DynamoDB
    sync_user_to_employee(instance)

# Receiver function to handle deletion of Django UserNew instance from DynamoDB 'Employees' table
@receiver(pre_delete, sender=UserNew)
def usernew_pre_delete_receiver(sender, instance, **kwargs):
    # Extract user_id from instance and convert it to string if necessary
    user_id = str(instance.id)
    # Call the utility function to delete the employee instance from DynamoDB
    delete_employee_from_dynamodb(instance.id)

# backend/apps/scheduling/urls.py
from django.urls import path
from .views import (
    get_employee,
    events_list,
    employees_list,
    add_employee,
    delete_employee,
    employee_events,
)

urlpatterns = [
    path('employee/<str:employee_id>/', get_employee, name='get_employee'),
    path('events/', events_list, name='events_list'),
    path('employees/', employees_list, name='employees_list'),
    path('add-employee/', add_employee, name='add_employee'),
    path('delete-employee/<str:employee_id>/', delete_employee, name='delete_employee'),
    path('employee-events/<str:employee_id>/', employee_events, name='employee_events'),
]

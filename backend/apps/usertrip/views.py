from rest_framework import status
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from ..user.authentication import DynamoDBJWTAuthentication
from rest_framework.response import Response
from validators.email import email as email_validator
from datetime import datetime
import uuid
from decimal import Decimal
from django.contrib.auth.hashers import make_password, check_password
from django.conf import settings
from .models import UserTrip, Productivity
from jwt import encode
import boto3
from PilotWebsite.settings import DB_ENDPOINT, DB_USERTRIP_TABLE
import os
from dotenv import load_dotenv

load_dotenv()

timestamp = datetime.now().isoformat()

@api_view(["GET"])
def test_aws(request):
    return Response(
        {"status": "success", "msg": "Congrats! Your backend is working on AWS!"},
        status=status.HTTP_200_OK,
    )


# DynamoDB Solution:
dynamodb = boto3.resource(
    "dynamodb",
    endpoint_url=os.getenv("DB_ENDPOINT"),
    region_name=os.getenv("DB_REGION_NAME"),
    aws_access_key_id=os.getenv("DB_AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("DB_AWS_SECRET_ACCESS_KEY"),
)

table = dynamodb.Table(DB_USERTRIP_TABLE)

@api_view(["POST", "PUT", "GET", "DELETE"])
@authentication_classes([DynamoDBJWTAuthentication])
@permission_classes([IsAdminUser])
def crud_usertrip(request, user_id=None):
    try:
        if request.method == "POST":
            trip_id = str(uuid.uuid4())
            user_id = request.data["user_id"]
            vessel = request.data["vessel"]
            departure = int(request.data["departure"])
            destination = int(request.data["destination"])
            date_created = datetime.strptime(request.data["date_created"], "%Y-%m-%d").date()
            trip_type = int(request.data["trip_type"])
            double = int(request.data["double"])
            notes = request.data["notes"]

            # New user data to be saved on database:
            record = UserTrip(
                trip_id=trip_id,
                user_id=user_id,
                vessel=vessel,
                date=date_created,
                departure=departure,
                destination=destination,
                trip_type=trip_type,
                double=double,
                notes=notes
            )
            # Save the data gathered for new user on DynamoDB
            record.save()
            return Response(
                {"success": True, "message": "User Trip created successfully"},
                status.HTTP_201_CREATED,
            )

        elif request.method == "PUT":
            trip_id = request.data["trip_id"]
            vessel = request.data["vessel"]
            departure = int(request.data["departure"])
            destination = int(request.data["destination"])
            date_created = datetime.strptime(request.data["date_created"], "%Y-%m-%d").date()
            trip_type = int(request.data["trip_type"])
            double = int(request.data["double"])
            notes = request.data["notes"]
            usertrip = UserTrip.get(trip_id=trip_id)
            print(usertrip)
            usertrip.update(
                vessel=vessel,
                departure=departure,
                destination=destination,
                date_created=date_created.isoformat(),
                trip_type=trip_type,
                double=double,
                notes=notes,
                updated_at=datetime.now(),
            )
            return Response({"success": True, "message": "User Trip updated successfully"})

        elif request.method == "GET":
            # Fetch all users:
            users = get_all_users()
            return Response(
                {
                    "success": True,
                    "data": users["all"],
                    "total_count": users["count"],
                }
            )

        elif request.method == "DELETE":
            user_id = request.GET.get("trip_id")
            # Delete the user from the DB
            table.delete_item(Key={"trip_id": trip_id})
            return Response({"success": True, "message": "User Trip deleted successfully"})

    except Exception as e:
        return Response(
            {"success": False, "message": f"Bad request: {str(e)}"},
            status.HTTP_400_BAD_REQUEST,
        )


# Fetch or get all users from DynamoDB
def get_all_users():
    # Fetch all users:
    result = table.scan()
    users_count = result["Count"]
    result = result["Items"]
    # Convert decimal values in users list into integers
    for item in result:
        for key, value in item.items():
            if isinstance(value, Decimal):
                item[key] = int(value)
    return {"all": result, "count": users_count}


@api_view(["POST"])
@authentication_classes([DynamoDBJWTAuthentication])
def get_usertrips(request):
    user_id = request.data["id"]
    result = table.scan()
    result = result["Items"]
    filtered_usertrip = []
    # Convert decimal values in users list into integers
    for item in result:
        if str(item['user_id']) == user_id:
            for key, value in item.items():
                if isinstance(value, Decimal):
                    item[key] = int(value)
            filtered_usertrip.append(item)

    return Response({"data": filtered_usertrip, "count": len(filtered_usertrip)})


@api_view(["POST"])
@authentication_classes([DynamoDBJWTAuthentication])
def get_total(request):
    user_id = request.data["id"]
    result = table.scan()
    result = result["Items"]
    filtered_usertrip = []
    total_full = 0
    total_partial = 0
    total_cancel = 0
    total_double = 0
    # Convert decimal values in users list into integers
    for item in result:
        if str(item['user_id']) == user_id:
            for key, value in item.items():
                if isinstance(value, Decimal):
                    item[key] = int(value)
            filtered_usertrip.append(item)
            
    for index, row in filtered_usertrip:
        # Perform processing on each row (e.g., calculate total distance)
        if (row['trip_type'] == 1):
            total_full += 1
        elif (row['trip_type'] == 2):
            total_partial += 1
        elif (row['trip_type'] == 3):
            total_cancel += 1
        total_double += 1 if row['double'] else 0

    total_assignments=total_full + total_cancel + total_partial

    try:
        id = str(uuid.uuid4())
        user_id = request.data['user_id']
        productivity=Productivity.get(user_id=user_id)
        productivity.update(
            total_assignments=total_assignments,
            total_full=total_full,
            total_parital=total_partial,
            total_cancel=total_cancel,
            total_double=total_double
        )
        return Response(
            {"success": True, "message": "User Productivity exists and updated successfully"}
        )

    except Productivity.DoesNotExist:
        record = Productivity(
            id=id,
            user_id=user_id,
            total_assignments=total_assignments,
            total_full=total_full,
            total_parital=total_partial,
            total_cancel=total_cancel,
            total_double=total_double
        )
        # Save the data gathered for new user productivity on DynamoDB
        record.save()
        return Response(
            {"success": True, "message": "User Productivity created successfully"},
            status.HTTP_201_CREATED,
        )

    except Exception as e:
        return Response(
            {"success": False, "message": f"Bad request: {e}"},
            status.HTTP_400_BAD_REQUEST,
        )

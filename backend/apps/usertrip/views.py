from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
)
from ..user.authentication import DynamoDBJWTAuthentication
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from datetime import datetime
import uuid
from decimal import Decimal
from django.conf import settings
from .models import UserTrip
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
    # endpoint_url=os.getenv("DB_ENDPOINT"),
    region_name=os.getenv("DB_REGION_NAME"),
    aws_access_key_id=os.getenv("DB_AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("DB_AWS_SECRET_ACCESS_KEY"),
)

trip_table = dynamodb.Table(DB_USERTRIP_TABLE)

@api_view(["POST", "PUT", "GET", "DELETE"])
@authentication_classes([DynamoDBJWTAuthentication])
def crud_usertrip(request, user_id=None):
    try:
        if request.method == "POST":
            trip_id = str(uuid.uuid4())
            user_id = request.data["user_id"]
            vessel = request.data["vessel"]
            departure = int(request.data["departure"])
            destination = int(request.data["destination"])
            date_created = request.data["date"]
            trip_type = int(request.data["tripType"])
            double = int(request.data["double"])
            try:
                notes = request.data["notes"]
            except KeyError:
                notes = ""
                
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
                notes=notes,
                year=str(datetime.now().year),
                updated_at=datetime.now().isoformat(),
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
            trip_id = request.GET.get("trip_id")
            user_id = request.GET.get("user_id")
            # Delete the user from the DB
            trip_table.delete_item(Key={"trip_id": trip_id, "user_id": user_id})
            return Response({"success": True, "message": "User Trip deleted successfully"})

    except Exception as e:
        return Response(
            {"success": False, "message": f"Bad request: {str(e)}"},
            status.HTTP_400_BAD_REQUEST,
        )


# Fetch or get all users from DynamoDB
def get_all_users():
    # Fetch all users:
    result = trip_table.scan()
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
    year = request.data.get("year")
    user_id = request.data.get("user_id")
    result = trip_table.scan()
    result = result["Items"]
    filtered_usertrip = []
    # Convert decimal values in users list into integers
    for item in result:
        if str(item['user_id']) == str(user_id) and item["year"] == str(year):
            for key, value in item.items():
                if isinstance(value, Decimal):
                    item[key] = int(value)
            filtered_usertrip.append(item)

    return Response({"data": filtered_usertrip, "count": len(filtered_usertrip)})
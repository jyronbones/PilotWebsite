from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
)
from ..user.authentication import DynamoDBJWTAuthentication
from rest_framework.response import Response
import pandas as pd
from datetime import datetime
import uuid
from decimal import Decimal
from .models import Availability
import boto3
from PilotWebsite.settings import DB_USERTRIP_TABLE, DB_AVAILABILITY
import os
from dotenv import load_dotenv

load_dotenv()

timestamp = datetime.now().isoformat()

# DynamoDB Solution:
dynamodb = boto3.resource(
    "dynamodb",
    endpoint_url=os.getenv("DB_ENDPOINT"),
    region_name=os.getenv("DB_REGION_NAME"),
    aws_access_key_id=os.getenv("DB_AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("DB_AWS_SECRET_ACCESS_KEY"),
)

availability_table = dynamodb.Table(DB_AVAILABILITY)

@api_view(["POST", "GET"])
@authentication_classes([DynamoDBJWTAuthentication])
def crud_availability(request):
    if request.method == "POST":
        effective = request.data["effective"]
        for row in effective:
            user_id = row["user_id"]
            apr = row["months"][0]
            may = row["months"][0]
            jun = row["months"][0]
            july = row["months"][0]
            aug = row["months"][0]
            sep = row["months"][0]
            oct = row["months"][0]
            nov = row["months"][0]
            dec = row["months"][0]
            print(apr)
            try:
                availability=Availability.get(user_id=user_id)
                if availability:
                    availability.update(
                        apr=apr,
                        may=may,
                        jun=jun,
                        july=july,
                        aug=aug,
                        sep=sep,
                        oct=oct,
                        nov=nov,
                        dec=dec,
                    )
                    return Response(
                        {"success": True, "message": "User Availability exists and updated successfully"}
                    )
                else:
                    raise Exception("Availability record not found for user")
        
            except Exception as e:
                return Response(
                    {"success": False, "message": f"Bad request: {str(e)}"},
                    status.HTTP_400_BAD_REQUEST,
                )
                
        
    elif request.method == "GET":
        availability = get_all_availability()
        return Response(
            {
                "success": True,
                "data": availability["all"],
                "total_count": availability["count"],
            }
        )


# Fetch or get all availability from DynamoDB
def get_all_availability():
    # Fetch all availability:
    result = availability_table.scan()
    count = result["Count"]
    result = result["Items"]
    # Convert decimal values in availability list into integers
    for item in result:
        for key, value in item.items():
            if isinstance(value, Decimal):
                item[key] = int(value)
    return {"all": result, "count": count}


@api_view(["POST"])
@authentication_classes([DynamoDBJWTAuthentication])
def initial_availability(request):
    user_id = request.data["user_id"]
    try:
        record = Availability(
                user_id=user_id,
                apr=0,
                may=0,
                jun=0,
                july=0,
                aug=0,
                sep=0,
                oct=0,
                nov=0,
                dec=0,
            )
        # Save the data gathered for new user productivity on DynamoDB
        record.save()
        return Response(
            {"success": True, "message": "User Productivity created successfully"},
            status.HTTP_201_CREATED,
        )

    except Exception as e:
        return Response(
            {"success": False, "message": f"Bad request: {str(e)}"},
            status.HTTP_400_BAD_REQUEST,
        )
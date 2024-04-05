from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAdminUser
from ..user.authentication import DynamoDBJWTAuthentication
from rest_framework.response import Response
import pandas as pd
from datetime import datetime
from decimal import Decimal
from .models import Productivity
import boto3
from PilotWebsite.settings import DB_TABLE, DB_USERTRIP_TABLE, DB_PROD_TABLE
import os
from dotenv import load_dotenv

load_dotenv()

timestamp = datetime.now().isoformat()

# DynamoDB Solution:
dynamodb = boto3.resource(
    "dynamodb",
    region_name=os.getenv("DB_REGION_NAME"),
    aws_access_key_id=os.getenv("DB_AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("DB_AWS_SECRET_ACCESS_KEY"),
)

user_table = dynamodb.Table(DB_TABLE)
trip_table = dynamodb.Table(DB_USERTRIP_TABLE)
prod_table = dynamodb.Table(DB_PROD_TABLE)

@api_view(["POST", "PUT"])
@authentication_classes([DynamoDBJWTAuthentication])
def crud_prod(request):
    try:
        if request.method == "POST":
            user_id = request.data["user_id"]
            year = request.data["year"]
            usertrips = trip_table.scan()
            usertrips = usertrips["Items"]
            filtered_usertrip = []
            total_full = 0
            total_partial = 0
            total_cancel = 0
            total_double = 0
            total_assignments = 0
            # Convert decimal values in users list into integers
            for item in usertrips:
                if str(item["user_id"]) == user_id and item["year"] == str(year):
                    for key, value in item.items():
                        if isinstance(value, Decimal):
                            item[key] = int(value)
                    filtered_usertrip.append(item)

            for row in filtered_usertrip:
                # Perform processing on each row (e.g., calculate total distance)
                if (row['trip_type'] == 0):
                    total_full += 1
                    print(total_full)
                elif (row['trip_type'] == 1):
                    total_partial += 1
                    print(total_partial)
                elif (row['trip_type'] == 2):
                    total_cancel += 1
                total_double += 1 if row['double'] else 0

            total_assignments=total_full + total_cancel + total_partial

            productivity=Productivity.get(user_id=user_id)
            productivity.update(
                total_assignments=total_assignments,
                total_full=total_full,
                total_partial=total_partial,
                total_cancel=total_cancel,
                total_double=total_double,
                total=total_assignments+productivity.auth_corp
            )
            print(productivity.total_full)
            print(productivity.total_partial)

            return Response(
                {"success": True, "message": "User Productivity exists and updated successfully"}
            )
        
        elif request.method == "PUT":
            daily_rate = request.data["daily_rate"]
            monthly_rate = request.data["monthly_rate"]

    except Exception as e:
        return Response(
            {"success": False, "message": f"Bad request: {str(e)}"},
            status.HTTP_400_BAD_REQUEST,
        )


# Fetch or get all assignments from DynamoDB
@api_view(["POST"])
@authentication_classes([DynamoDBJWTAuthentication])
def get_all_assignments(request):
    # Fetch all assignments:
    year = request.data["year"]
    result = prod_table.scan()
    result = result["Items"]
    filtered_productivity = []
    # Filter assignments based on selected year
    for item in result:
        if item["year"] == str(year):
            filtered_productivity.append(item)

    return Response(
                {
                    "success": True,
                    "data": filtered_productivity,
                    "total_count": len(filtered_productivity),
                }
            )


@api_view(["PUT"])
@authentication_classes([DynamoDBJWTAuthentication])
@permission_classes([IsAdminUser])
def update_auth_corp(request):
    data = request.data["auth_corp"]
    for id in data.keys():
        user_id = id
        auth_corp = data[user_id]
        productivity = Productivity.get(user_id=user_id)
        productivity.update(
            auth_corp=auth_corp,
            total=Decimal(productivity.total_assignments)+Decimal(auth_corp)
        )
        
    return Response({"success": True, "message": "User Auth Corp updated successfully"})


@api_view(["POST"])
@authentication_classes([DynamoDBJWTAuthentication])
def get_summary(request):
    year = request.data["year"]
    result = prod_table.scan()
    count = result["Count"]
    result = result["Items"]

    total_full = 0
    half_full = 0
    total_partial = 0
    total_cancel = 0
    total_double = 0
    total_assignments = 0
    filtered_prod = []

    for item in result:
        if item["year"] == str(year):
            filtered_prod.append(item)

    if len(filtered_prod) == 0:
        return Response({
                "data": {
                    "total_full": 0,
                    "half_full": 0,
                    "total_partial": 0,
                    "total_cancel": 0,
                    "total_double": 0,
                    "total_assignments": 0
                    } 
                })

    df = pd.DataFrame(filtered_prod)

    if count != 0:
        total_full = float(df["total_full"].sum())
        half_full = float(total_full / 2)
        total_partial = float(df["total_partial"].sum())
        total_cancel = float(df["total_cancel"].sum())
        total_double = float(df["total_double"].sum())
        total_assignments = float(half_full + total_partial + total_cancel + total_double)

    return Response({
                "data": {
                    "total_full": total_full,
                    "half_full": half_full,
                    "total_partial": total_partial,
                    "total_cancel": total_cancel,
                    "total_double": total_double,
                    "total_assignments": total_assignments
                    } 
                })
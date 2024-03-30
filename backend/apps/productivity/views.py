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
from .models import Productivity
import boto3
from PilotWebsite.settings import DB_USERTRIP_TABLE, DB_PROD_TABLE
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

trip_table = dynamodb.Table(DB_USERTRIP_TABLE)
prod_table = dynamodb.Table(DB_PROD_TABLE)

@api_view(["POST", "GET"])
@authentication_classes([DynamoDBJWTAuthentication])
def crud_prod(request):
    try:
        if request.method == "POST":
            user_id = request.data["user_id"]
            result = trip_table.scan()
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

            for row in filtered_usertrip:
                # Perform processing on each row (e.g., calculate total distance)
                if (row['trip_type'] == 0):
                    total_full += 1
                elif (row['trip_type'] == 1):
                    total_partial += 1
                elif (row['trip_type'] == 2):
                    total_cancel += 1
                total_double += 1 if row['double'] else 0

            total_assignments=total_full + total_cancel + total_partial
            # print(total_full)
            # print(total_partial)
            # print(total_cancel)
            # print(total_double)
            # print(total_assignments)

            try:
                productivity=Productivity.get(user_id=user_id)
                print("prod: ", productivity)

                if productivity:
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
                else:
                    raise Exception("Productivity record not found for user")
            
            except Exception as e:
                record = Productivity(
                    id=id,
                    user_id=user_id,
                    total_assignments=total_assignments,
                    total_full=total_full,
                    total_partial=total_partial,
                    total_cancel=total_cancel,
                    total_double=total_double
                )
                # Save the data gathered for new user productivity on DynamoDB
                record.save()
                return Response(
                    {"success": True, "message": "User Productivity created successfully"},
                    status.HTTP_201_CREATED,
                )
            
        elif request.method == "GET":
            users = get_all_assignments()
            return Response(
                {
                    "success": True,
                    "data": users["all"],
                    "total_count": users["count"],
                }
            )
    except Exception as e:
        return Response(
            {"success": False, "message": f"Bad request: {str(e)}"},
            status.HTTP_400_BAD_REQUEST,
        )


# Fetch or get all users from DynamoDB
def get_all_assignments():
    # Fetch all users:
    result = prod_table.scan()
    users_count = result["Count"]
    result = result["Items"]
    # Convert decimal values in users list into integers
    for item in result:
        for key, value in item.items():
            if isinstance(value, Decimal):
                item[key] = int(value)
    return {"all": result, "count": users_count}


@api_view(["GET"])
@authentication_classes([DynamoDBJWTAuthentication])
def get_summary(request):
    result = prod_table.scan()
    count = result["Count"]
    result = result["Items"]
    total_full = 0
    half_full = 0
    total_partial = 0
    total_cancel = 0
    total_double = 0
    total_assignments = 0
    df = pd.DataFrame(result)

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
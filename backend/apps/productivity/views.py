from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from dotenv import load_dotenv
from rest_framework.permissions import IsAdminUser
from ..user.authentication import DynamoDBJWTAuthentication
from rest_framework.response import Response
from datetime import datetime
from decimal import Decimal
from .models import Productivity, ProductivitySupport
from PilotWebsite.settings import DB_TABLE, DB_USERTRIP_TABLE, DB_PRODUCTIVITY, DB_PRODUCTIVITY_SUPP
import uuid
import boto3
import os

load_dotenv()

timestamp = datetime.now().isoformat()

# DynamoDB Solution:
dynamodb = boto3.resource(
    "dynamodb",
    endpoint_url=os.getenv("DB_ENDPOINT"), # Uncomment this line to use a local DynamoDB instance
    region_name=os.getenv("DB_REGION_NAME"),
    aws_access_key_id=os.getenv("DB_AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("DB_AWS_SECRET_ACCESS_KEY"),
)

user_table = dynamodb.Table(DB_TABLE)
trip_table = dynamodb.Table(DB_USERTRIP_TABLE)
prod_table = dynamodb.Table(DB_PRODUCTIVITY)
prod_supp_table = dynamodb.Table(DB_PRODUCTIVITY_SUPP)

@api_view(["POST"])
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

            for item in filtered_usertrip:
                # Perform processing on each row (e.g., calculate total distance)
                if item["trip_type"] == 0:
                    total_full += 1
                elif item["trip_type"] == 1:
                    total_partial += 1
                elif item["trip_type"] == 2:
                    total_cancel += 1
                total_double += 1 if item["double"] else 0

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

            return Response(
                {"success": True, "message": "User Productivity exists and updated successfully"}
            )

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
    prod = prod_table.scan()
    prod = prod["Items"]

    prod_supp = prod_supp_table.scan()
    prod_supp = prod_supp["Items"]

    filtered_productivity = []
    shared_value = 0
    # Filter assignments based on selected year
    for item in prod_supp:
        if item["year"] == str(year):
            shared_value = item["shared_value"]
    for item in prod:
        if item["year"] == str(year):
            productivity = Productivity.get(user_id=item["user_id"])
            productivity.update(
                amount_shared=shared_value*item["total"]
            )

    prod = prod_table.scan()
    prod = prod["Items"]
    for item in prod:
        if item["year"] == str(year):
            filtered_productivity.append(item)

    return Response(
                {
                    "success": True,
                    "data": filtered_productivity,
                    "total_count": len(filtered_productivity),
                }
            )


# Update auth_corp depending on user inputs
@api_view(["PUT"])
@authentication_classes([DynamoDBJWTAuthentication])
@permission_classes([IsAdminUser])
def update_auth_corp(request):
    data = request.data["auth_corp"]

    try:
        for id in data.keys():
            user_id = id
            auth_corp = data[user_id]
            productivity = Productivity.get(user_id=user_id)
            productivity.update(
                auth_corp=auth_corp,
                total=Decimal(productivity.total_assignments)+Decimal(auth_corp)
            )
    except Exception as e:
        return Response(
            {"success": False, "message": f"Bad request: {str(e)}"},
            status.HTTP_400_BAD_REQUEST,
        )      
    return Response({"success": True, "message": "User Auth Corp updated successfully"})

# Fetch and return calculated attributes for Productivity and Summary Page
@api_view(["POST"])
@authentication_classes([DynamoDBJWTAuthentication])
def get_assignment_summary(request):
    year = request.data["year"]
    result = prod_table.scan()
    result = result["Items"]

    total_full = 0
    half_full = 0
    total_partial = 0
    total_cancel = 0
    total_double = 0
    total_assignments = 0
    productivity = 0
    auth_corp = 0
    total = 0
    amount_shared = 0

    for item in result:
        if item["year"] == str(year):
            total_full += max(0, item["total_full"])
            total_partial += max(0, item["total_partial"])
            total_cancel += max(0, item["total_cancel"])
            total_double += max(0, item["total_double"])
            auth_corp += max(0, item["auth_corp"])
            amount_shared += max(0, item["amount_shared"])
            total_assignments += max(0, item["total_assignments"])

    half_full = Decimal(total_full / 2)
    productivity = Decimal(half_full + total_partial + total_cancel + total_double)
    total = Decimal(auth_corp + total_assignments)

    return Response({
                "data": {
                    "total_full": total_full,
                    "half_full": half_full,
                    "total_partial": total_partial,
                    "total_cancel": total_cancel,
                    "total_double": total_double,
                    "total_assignments": total_assignments,
                    "auth_corp": Decimal(auth_corp),
                    "productivity": productivity,
                    "total": total,
                    "amount_shared": Decimal(amount_shared),
                    } 
                })


# Update daily rate and monthly rate according to filtered year
@api_view(["PUT"])
@authentication_classes([DynamoDBJWTAuthentication])
@permission_classes([IsAdminUser])
def update_rate(request):
    year = request.data["year"]
    daily_rate = request.data["daily_rate"]
    monthly_rate = request.data["monthly_rate"]

    prodsupp = prod_supp_table.scan()
    prodsupp = prodsupp["Items"]
    try:       
        for item in prodsupp:
            if item["year"] == str(year):
                record = ProductivitySupport.get(id=item["id"])
                record.update(
                    daily_rate=daily_rate,
                    monthly_rate=monthly_rate,
                )

        return Response({"success": True, "message": "Daily Rate and Monthly Rate updated successfully"})
    
    except Exception as e:
        return Response(
            {"success": False, "message": f"Bad request: {str(e)}"},
            status.HTTP_400_BAD_REQUEST,
        ) 
    
# Fetch all data from Productivity Support Table according to filtered year
@api_view(["POST"])
@authentication_classes([DynamoDBJWTAuthentication])
def get_productivity_supp(request):
    year = request.data["year"]
    productive_assignments = request.data["productive_assignments"]
    total = Decimal(request.data["total"])
    if productive_assignments is None:
        productive_assignments = 0
    if total is None or total == 0:
        total = 1

    prodsupp = prod_supp_table.scan()
    prodsupp = prodsupp["Items"]
    try:       
        for item in prodsupp:
            if item["year"] == str(year):
                record = ProductivitySupport.get(id=item["id"])
                sum_accummulated = Decimal(productive_assignments * item["daily_rate"] * 2)
                shared_value=round(sum_accummulated / total)
                record.update(
                    sum_accummulated=sum_accummulated,
                    shared_value=shared_value,
                )
    except Exception as e:
        return Response(
            {"success": False, "message": f"Bad request: {str(e)}"},
            status.HTTP_400_BAD_REQUEST,
        ) 
    
    prodsupp = prod_supp_table.scan()
    prodsupp = prodsupp["Items"]
    for item in prodsupp:
        if item["year"] == str(year):
            return Response({"success": True, "data": item})
    return Response({"success": True, "message": "Daily Rate and Monthly Rate updated successfully"})


# Fetch and Create year
@api_view(["GET", "POST"])
@authentication_classes([DynamoDBJWTAuthentication])
def crud_year(request):
    try:
        # Add new year at the 1st of Jan each year
        if request.method == "POST":
            if datetime.now().month == 1 and datetime.now().day == 1:
                prodsupp = ProductivitySupport(
                    id=str(uuid.uuid4()),
                    year=str(datetime.now().year),
                    shared_value=0,
                    daily_rate=10,
                    monthly_rate=10000,
                )
                prodsupp.save()
            
                return Response(
                        {"success": True, "message": "Added new year successfully"},
                        status.HTTP_201_CREATED,
                    )
            else:
                return Response(
                        {"success": False, "message": "Today is not the beginning day of the year"},
                        status.HTTP_406_NOT_ACCEPTABLE,
                    )
        # Fetch years list inputted every year
        elif request.method == "GET":
            prodsupp = prod_supp_table.scan()
            prodsupp = prodsupp["Items"]
            years = []

            for item in prodsupp:
                years.append(int(item["year"]))

            years = sorted(years)
            print(years)
            return Response(
                        {
                            "success": True,
                            "data": years,
                            "total_count": len(years),
                        }
                    )
    except Exception as e:
            return Response(
                {"success": False, "message": f"Bad request: {str(e)}"},
                status.HTTP_400_BAD_REQUEST,
            )

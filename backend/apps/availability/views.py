from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
)
from ..user.authentication import DynamoDBJWTAuthentication
from rest_framework.response import Response
from datetime import datetime
import uuid
from .models import Availability
import boto3
from PilotWebsite.settings import DB_AVAILABILITY
import os
from dotenv import load_dotenv

load_dotenv()

# DynamoDB Solution:
dynamodb = boto3.resource(
    "dynamodb",
    # endpoint_url=os.getenv("DB_ENDPOINT"), # Uncomment this line to use a local DynamoDB instance
    region_name=os.getenv("DB_REGION_NAME"),
    aws_access_key_id=os.getenv("DB_AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("DB_AWS_SECRET_ACCESS_KEY"),
)

availability_table = dynamodb.Table(DB_AVAILABILITY)

# Update availability of each pilot depending on specific year
@api_view(["PUT", "POST", "GET"])
@authentication_classes([DynamoDBJWTAuthentication])
def crud_availability(request):
    try:
        if request.method == "PUT":
            data = request.data["availability"]
            year = str(datetime.now().year)
            for id in data.keys():
                user_id = id
                availability = data[user_id]
                apr = availability[0]
                may = availability[1]
                jun = availability[2]
                jul = availability[3]
                aug = availability[4]
                sep = availability[5]
                oct = availability[6]
                nov = availability[7]
                dec = availability[8]
                id = availability[9]

                availability_instance = Availability.get(id=id, user_id=user_id)
                if (availability_instance and availability_instance.year == year):
                    availability_instance.update(
                        apr=apr,
                        may=may,
                        jun=jun,
                        jul=jul,
                        aug=aug,
                        sep=sep,
                        oct=oct,
                        nov=nov,
                        dec=dec,
                    )
                elif (availability_instance.year != year):
                    new_availability = Availability(
                        id=str(uuid.uuid4()),
                        user_id=user_id,
                        year=year,
                        apr=apr,
                        may=may,
                        jun=jun,
                        jul=jul,
                        aug=aug,
                        sep=sep,
                        oct=oct,
                        nov=nov,
                        dec=dec,
                    )
                    new_availability.save()
                
            result = availability_table.scan()
            result = result["Items"]
            each_m_effective = 0
            for item in result:
                each_m_effective = sum(1 for key, value in item.items() if isinstance(value, bool) and value)
                availability_instance = Availability.get(id=item["id"], user_id=item["user_id"])
                availability_instance.update(total_effective=each_m_effective)

            return Response(
                {"success": True, "message": "All User Availability exists and updated successfully"}
            )

        elif request.method == "POST":
            year = request.data["year"]
            if (int(year) > int(datetime.now().year)):
                print('need list of users to create for future years')

            result = availability_table.scan()
            result = result["Items"]
            filtered_availability = []
            # Filter availability based on selected year
            for item in result:
                if item["year"] == str(year):
                    filtered_availability.append(item)
            
            return Response({"success": True, "data": filtered_availability, "total_count": len(filtered_availability)})
        
    except Exception as e:
        return Response(
            {"success": False, "message": f"Bad request: {str(e)}"},
            status.HTTP_400_BAD_REQUEST,
        )

# Fetch effective pilot and threshold for Productivity Page
@api_view(["POST"])
@authentication_classes([DynamoDBJWTAuthentication])
def get_effective(request):
    year = request.data["year"]
    result = availability_table.scan()
    result = result["Items"]
    filtered_availability = []
    total = 0

    for item in result:
        if item["year"] == str(year):
            filtered_availability.append(item)

    if len(filtered_availability) == 0:
        return Response({
                            "success": True, 
                            "data": {
                                "total_effective": 0, 
                                "threshold": 0
                            }
                        })
    
    for item in filtered_availability:
        total += item["total_effective"]
    total /= 9
    total_effective = round(total, 2)
    ######## TESTING ###########
    #threshold = round(total_effective * 2, 2)
    ######## TESTING ###########
    threshold = round(total_effective * 54, 2)

    return Response(
        {
            "success": True, 
            "data": {
                "total_effective": total_effective, 
                "threshold": threshold
            }
        })
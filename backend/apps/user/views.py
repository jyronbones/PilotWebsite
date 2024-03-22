from rest_framework import status
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .authentication import DynamoDBJWTAuthentication
from rest_framework.response import Response
from validators.email import email as email_validator
from datetime import datetime
import uuid
from decimal import Decimal
from django.contrib.auth.hashers import make_password, check_password
from django.conf import settings
from .models import UserNew, outstandingToken
from jwt import encode
import boto3
from PilotWebsite.settings import DB_ENDPOINT, DB_TABLE
import os
from dotenv import load_dotenv

load_dotenv()

timestamp = datetime.now().isoformat()


# This view generates access and refresh tokens for the user
def generate_tokens(user_id):
    try:
        user = UserNew.get(id=user_id)
    except UserNew.DoesNotExist:
        return None

    # Generate a unique JWT ID (jti) for access token
    jti_access_token = uuid.uuid4()

    # Create JWT access token
    access_token_payload = {
        "user_id": str(user.id),
        "exp": datetime.utcnow() + settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
        "iat": datetime.utcnow(),
        "jti": str(jti_access_token),
    }
    access_token = encode(access_token_payload, settings.SECRET_KEY, algorithm="HS256")

    # Generate a unique JWT ID (jti) for refresh token
    jti_refresh_token = uuid.uuid4()

    # Create JWT refresh token
    refresh_token_payload = {
        "token_type": "refresh",
        "user_id": str(user.id),
        "exp": datetime.utcnow() + settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
        "iat": datetime.utcnow(),
        "jti": str(jti_refresh_token),
    }
    refresh_token = encode(
        refresh_token_payload, settings.SECRET_KEY, algorithm="HS256"
    )

    # Save tokens in DynamoDB table
    now = datetime.utcnow()
    expires_at_access = now + settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"]
    expires_at_refresh = now + settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"]

    save_access_token = outstandingToken(
        id=jti_access_token,
        token_type="access",
        token=access_token,
        created_at=now.isoformat(),
        expires_at=expires_at_access.isoformat(),
        user_id=user.id,
        is_authenticated=True,
        jti=str(jti_access_token),
    )

    save_access_token.save()

    save_refresh_token = outstandingToken(
        id=jti_refresh_token,
        token_type="refresh",
        token=refresh_token,
        created_at=now.isoformat(),
        expires_at=expires_at_refresh.isoformat(),
        user_id=user.id,
        is_authenticated=True,
        jti=str(jti_refresh_token),
    )

    save_refresh_token.save()

    return {
        "accessToken": access_token,
        "refreshToken": refresh_token,
    }


@api_view(["GET"])
def test_aws(request):
    return Response(
        {"status": "success", "msg": "Congrats! Your backend is working on AWS!"},
        status=status.HTTP_200_OK,
    )


# # This view not used anywhere in the frontend
@api_view(["POST"])
def refresh_token(request):
    get_refresh_token = request.data.get("refresh_token")

    if not get_refresh_token:
        return Response(
            {"success": False, "error": "Refresh token is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        refreshToken = RefreshToken(get_refresh_token)
        access_token = str(refreshToken.access_token)
        new_refresh_token = str(refreshToken)
        return Response(
            {
                "success": True,
                "accessToken": access_token,
                "refreshToken": new_refresh_token,
            },
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        return Response(
            {"success": False, "message": str(e)}, status=status.HTTP_400_BAD_REQUEST
        )


# DynamoDB Solution:


dynamodb = boto3.resource(
    "dynamodb",
    endpoint_url=os.getenv("DB_ENDPOINT"), # this is used for localhost
    region_name=os.getenv("DB_REGION_NAME"),
    aws_access_key_id=os.getenv("DB_AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("DB_AWS_SECRET_ACCESS_KEY"),
)

table = dynamodb.Table(DB_TABLE)


@api_view(["POST"])
def credential_login(request):
    try:
        """
        This view verify user's email and password
        :param request:
        :return: Success status, message, status code
        """
        email = request.data.get("email", None)
        if email_validator(email) is not True:
            return Response(
                {"success": True, "message": "Email is not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not request.data.get("password") or not request.data.get("email"):
            return Response(
                {"success": False, "message": "Invalid Credentials"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        email = str(email).lower()
        new_get_user = new_login_auth(
            user_email=email, password=request.data.get("password")
        )
        if new_get_user["status"] == "success":
            token = generate_tokens(new_get_user["user_id"])
            user = UserNew.get(id=new_get_user["user_id"])
            # Update user's last login time and date in DynamoDB
            user.update(last_login=datetime.now())
            return Response(
                {
                    "success": True,
                    "message": "Login successful",
                    "accessToken": token["accessToken"],
                    "refreshToken": token["refreshToken"],
                    "user_type": new_get_user["user_type"],
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"success": False, "message": "Invalid Credentials"},
                status=status.HTTP_404_NOT_FOUND,
            )
    except Exception as e:
        return Response(
            {"success": False, "message": f"bad request {e}"},
            status.HTTP_400_BAD_REQUEST,
        )


# This function is used to verify the email and password sent by login endpoint (credential_login) view
def new_login_auth(user_email, password):
    # Fetch user from the DB
    result = UserNew.scan(email=user_email)

    # Iterate through the items in the result
    user = list(result)  # Convert the iterator to a list
    org_password = ""
    if user:
        for item in user:
            org_password = item.password
            org_user_id = item.id
            org_user_type = item.user_type
        if check_password(password, org_password):
            return {
                "status": "success",
                "user_id": org_user_id,
                "user_type": org_user_type,
            }

    return {"status": "failed"}


# This view checks weather the user is authenticated or not
@api_view(["GET"])
@authentication_classes([DynamoDBJWTAuthentication])
@permission_classes([IsAuthenticated])
def auth_me(request):
    try:
        if request.user.is_active is False:
            return Response(
                {"success": False, "message": "User not found, contact our support"},
                status.HTTP_404_NOT_FOUND,
            )

        data = {
            "full_name": request.user.full_name,
            "email": request.user.email,
            "created_at": request.user.created_at,
            "user_type": request.user.user_type,
        }
        return Response({"success": True, "details": data})
    except Exception as e:
        return Response(
            {"success": False, "message": f"bad request {e}"},
            status.HTTP_400_BAD_REQUEST,
        )


# # This view is just for testing purpose,
# # if you want to create an admin quickly without any restrictions you can use this
@api_view(["POST"])
def create_admin_account(request):
    try:
        user_id = str(uuid.uuid4())
        full_name = request.data["full_name"]
        first_name = ""
        last_name = ""
        email = request.data["email"]
        user_type = int(request.data["user_type"])
        password = make_password(request.data["password"])
        date_joined = timestamp
        created_at = timestamp
        updated_at = timestamp
        is_superuser = False
        is_staff = False
        is_active = True
        is_authenticated = True
        last_login = None

        # If the new user is admin then do this:
        if user_type == 1:
            is_superuser = True
            is_staff = True

        # Retrun a fail msg if the user is already exist in the DB
        user_exist = check_user(email)
        if user_exist:
            return Response(
                {
                    "success": False,
                    "message": f"User with the {email} email is already exist!",
                }
            )

        # New user data to be saved on database:
        record = UserNew(
            id=user_id,
            full_name=full_name,
            first_name=first_name,
            last_name=last_name,
            email=email,
            user_type=user_type,
            password=password,
            date_joined=date_joined,
            created_at=created_at,
            updated_at=updated_at,
            is_superuser=is_superuser,
            is_staff=is_staff,
            is_active=is_active,
            is_authenticated=is_authenticated,
            last_login=last_login,
        )
        # Save the data gathered for new user on DynamoDB
        record.save()
        return Response(
            {"success": True, "message": "User created successfully"},
            status.HTTP_201_CREATED,
        )
    except Exception as e:
        return Response(
            {"success": False, "message": f"Bad request: {str(e)}"},
            status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST", "PUT", "GET", "DELETE"])
@authentication_classes([DynamoDBJWTAuthentication])
@permission_classes([IsAdminUser])
def admin_user_crud(request, user_id=None):
    try:
        if request.method == "POST":
            user_id = str(uuid.uuid4())
            full_name = request.data["full_name"]
            first_name = ""
            last_name = ""
            email = request.data["email"]
            user_type = int(request.data["user_type"])
            password = make_password(request.data["password"])
            date_joined = timestamp
            created_at = timestamp
            updated_at = timestamp
            is_superuser = False
            is_staff = False
            is_active = True
            is_authenticated = True
            last_login = None

            # If the new user is admin then do this:
            if user_type == 1:
                is_superuser = True
                is_staff = True

            # Retrun a fail msg if the user is already exist in the DB
            user_exist = check_user(email)
            if user_exist:
                return Response(
                    {
                        "success": False,
                        "message": f"User with the {email} email is already exist!",
                    }
                )

            # New user data to be saved on database:
            record = UserNew(
                id=user_id,
                full_name=full_name,
                first_name=first_name,
                last_name=last_name,
                email=email,
                user_type=user_type,
                password=password,
                date_joined=date_joined,
                created_at=created_at,
                updated_at=updated_at,
                is_superuser=is_superuser,
                is_staff=is_staff,
                is_active=is_active,
                is_authenticated=is_authenticated,
                last_login=last_login,
            )
            # Save the data gathered for new user on DynamoDB
            record.save()
            return Response(
                {"success": True, "message": "User created successfully"},
                status.HTTP_201_CREATED,
            )

        elif request.method == "PUT":
            user_id = request.data["user_id"]
            full_name = request.data["full_name"]
            email = request.data["email"]
            password = request.data["password"]
            user_type = request.data["user_type"]
            user = UserNew.get(id=user_id)
            user.update(
                full_name=full_name,
                email=email,
                password=password,
                updated_at=datetime.now(),
                user_type=user_type,
            )
            return Response({"success": True, "message": "User updated successfully"})

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
            user_id = request.GET.get("user_id")
            # Delete the user from the DB
            table.delete_item(Key={"id": user_id})
            return Response({"success": True, "message": "User deleted successfully"})

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


# Check the user email in DynamoDB if it's exist or not
def check_user(email):
    user = list(UserNew.scan(email=email))
    if user:
        return True
    else:
        return False
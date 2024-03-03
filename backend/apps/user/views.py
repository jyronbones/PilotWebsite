from django.contrib.auth import authenticate as login_auth
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.response import Response
from validators.email import email as email_validator
from django.shortcuts import get_object_or_404

from apps.user.models import User
from apps.user.serializers import UserSerializer


def get_jwt_token(user):
    """Function for jwt access and refresh token"""
    refresh = RefreshToken.for_user(user)

    return {
        'refreshToken': str(refresh),
        'accessToken': str(refresh.access_token)
    }


@api_view(['POST'])
def credential_login(request):
    try:
        """
        This view verify user's email and password and if both credentials are correct then send 6 digit random int type
        otp to user's mail
        :param request:
        :return: Success status, message, status code
        """
        email = request.data.get('email', None)
        if email_validator(email) is not True:
            return Response({'success': True, 'message': 'Email is not valid'},
                            status=status.HTTP_400_BAD_REQUEST)
        if not request.data.get('password') or not request.data.get('email'):
            return Response({
                'success': False,
                'message': 'Invalid Credentials'
            }, status=status.HTTP_400_BAD_REQUEST)
        get_user = login_auth(email=str(email).lower(), password=request.data.get('password'))
        if get_user:
            token = get_jwt_token(get_user)
            return Response({'success': True, 'message': 'Login successful', 'accessToken': token['accessToken'],
                             'refreshToken': token['refreshToken'], 'user_type': get_user.user_type},
                            status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'message': 'Invalid Credentials'
            }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'success': False, 'message': f'bad request {e}'}, status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def auth_me(request):
    try:
        if request.user.is_active is False:
            return Response({'success': False, 'message': 'User not found, contact our support'},
                            status.HTTP_404_NOT_FOUND)

        data = {
            'full_name': request.user.full_name,
            'email': request.user.email,
            'created_at': request.user.created_at,
            'user_type': request.user.user_type
        }
        return Response({'success': True, 'details': data})
    except Exception as e:
        return Response({'success': False, 'message': f'bad request {e}'}, status.HTTP_400_BAD_REQUEST)


<<<<<<< Updated upstream
@api_view(['POST'])
def refresh_token(request):
    get_refresh_token = request.data.get('refresh_token')

    if not get_refresh_token:
        return Response({'success': False, 'error': 'Refresh token is required.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        refreshToken = RefreshToken(get_refresh_token)
        access_token = str(refreshToken.access_token)
        new_refresh_token = str(refreshToken)
        return Response({'success': True, 'accessToken': access_token, 'refreshToken': new_refresh_token},
                        status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'success': False, 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
=======
# This view is just for testing purpose,
# if you want to create an admin quickly without any restrictions you can use this
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
>>>>>>> Stashed changes


@api_view(['POST', 'PUT', 'GET', 'DELETE'])
@permission_classes([IsAdminUser])
def admin_user_crud(request, user_id=None):
    try:
        if request.method == 'POST':
            # Include the password in the request.data
            password = request.data['password']
            request.data['password'] = password

            # Use the UserSerializer to validate and save the data
            serializer = UserSerializer(data=request.data)

            if serializer.is_valid():
                # Set the user password before saving
                user = serializer.save()
                user.user_type = request.data.get('user_type', 2)
                user.set_password(password)
                user.save()

                return Response({'success': True, 'message': 'User created successfully'}, status.HTTP_201_CREATED)

            return Response({'success': False, 'message': 'Invalid data'}, status.HTTP_400_BAD_REQUEST)

        elif request.method == 'PUT':
            user_id = request.data['user_id']
            user = get_object_or_404(User, id=user_id)
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({'success': True, 'message': 'User updated successfully'})
            return Response({'success': False, 'message': 'Invalid data'}, status.HTTP_400_BAD_REQUEST)

        elif request.method == 'GET':
            user_id = request.GET.get('user_id')
            if user_id:
                user = get_object_or_404(User, id=user_id)
                serializer = UserSerializer(user)
                return Response({'success': True, 'data': serializer.data})
            else:
                index = int(request.query_params.get('index', 0))
                offset = int(request.query_params.get('offset', 10))
                users = User.objects.all()[index:index + offset]
                serializer = UserSerializer(users, many=True)
                return Response({'success': True, 'data': serializer.data, 'total_count': users.count()})

        elif request.method == 'DELETE':
            user_id = request.GET.get('user_id')
            user = get_object_or_404(User, id=user_id)
            user.delete()
            return Response({'success': True, 'message': 'User deleted successfully'})

    except Exception as e:
<<<<<<< Updated upstream
        return Response({'success': False, 'message': f'Bad request: {str(e)}'}, status.HTTP_400_BAD_REQUEST)
=======
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
>>>>>>> Stashed changes

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
        return Response({'success': False, 'message': f'Bad request: {str(e)}'}, status.HTTP_400_BAD_REQUEST)

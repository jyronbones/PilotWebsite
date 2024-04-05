from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import outstandingToken, UserNew
import jwt
from django.conf import settings


class DynamoDBJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.headers.get('Authorization')

        if not token:
            return None
        # Extract JWT token from the Authorization header
        if token.startswith('Bearer '):
            token = token.split(' ')[1]  # Remove 'Bearer ' prefix
        try:
            # Decode the token
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

            # Check if token exists in DynamoDB
            token_record = list(outstandingToken.scan(jti=decoded_token['jti']))

            user_record = list(UserNew.scan(id=decoded_token["user_id"]))

            # You may need to add additional checks here, like token expiration

            return user_record[0], token_record[0]  # Return the authenticated token and user record
        # except outstandingToken.DoesNotExist:
        #     raise AuthenticationFailed('Invalid token')
        except jwt.exceptions.DecodeError as e:
            raise AuthenticationFailed('Error decoding token: {}'.format(str(e)))

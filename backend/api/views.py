# api/views.py

from django.contrib.auth import get_user_model, authenticate
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.authentication import JWTAuthentication



User = get_user_model()

def _get_tokens_for_user(user):
    """
    Helper to create both refresh and access tokens for a given user.
    """
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    """
    POST { "username": "", "password": "", "email": "" }
    → creates a new user and returns JWT tokens.
    """
    username = request.data.get('username')
    password = request.data.get('password')
    email    = request.data.get('email')

    if 'utoronto.ca' not in email:
        return Response(
            {'detail': 'Email must be a valid @utoronto.ca email address.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not username or not password:
        return Response(
            {'detail': 'Username and password required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {'detail': 'Username already taken.'},
            status=status.HTTP_409_CONFLICT
        )

    user = User.objects.create_user(username=username, email=email, password=password)
    tokens = _get_tokens_for_user(user)
    return Response(tokens, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    POST { "username": "", "password": "" }
    → validates credentials and returns JWT tokens.
    """
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'detail': 'Username and password required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(request, username=username, password=password)
    if user is None:
        return Response(
            {'detail': 'Invalid credentials.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    tokens = _get_tokens_for_user(user)
    return Response(tokens, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])      # ← only JWT, no SessionAuth
@permission_classes([IsAuthenticated])
def logout(request):
    refresh_token = request.data.get('refresh')
    if not refresh_token:
        return Response({'detail': 'Refresh token required.'},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        RefreshToken(refresh_token).blacklist()
        return Response(status=status.HTTP_205_RESET_CONTENT)
    except TokenError:
        return Response({'detail': 'Invalid or expired token.'},
                        status=status.HTTP_400_BAD_REQUEST)
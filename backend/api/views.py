# api/views.py

from django.contrib.auth import get_user_model, authenticate
from rest_framework.decorators import api_view, permission_classes, authentication_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404
from .models import User
from .utils import process_swipe, process_match, process_unmatch, recommend_for

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

def _get_user_from_refresh(refresh_token):
    """
    Given a refresh token string, return the corresponding User instance.
    Raises TokenError if the token is invalid.
    """
    token = RefreshToken(refresh_token)
    user_id = token['user_id']
    return User.objects.get(pk=user_id)


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
    """
    POST { "refresh": "<refresh_token>" }
    → blacklists the given refresh token, effectively logging the user out.
    """
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


@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser])
def upload_profile_image(request):
    """
    POST multipart/form-data {
      "refresh": "<refresh_token>",
      "profile_picture": <file>
    }
    → validates refresh token, updates `user.profile_picture`.
    """
    refresh = request.data.get('refresh')
    image = request.FILES.get('profile_picture')

    if not refresh:
        return Response({'detail': 'Refresh token required.'},
                        status=status.HTTP_400_BAD_REQUEST)
    if not image:
        return Response({'detail': 'No profile picture provided.'},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        user = _get_user_from_refresh(refresh)
    except (TokenError, User.DoesNotExist):
        return Response({'detail': 'Invalid or expired token.'},
                        status=status.HTTP_401_UNAUTHORIZED)

    user.profile_picture = image
    user.save(update_fields=['profile_picture'])
    return Response({'detail': 'Profile picture updated.'},
                    status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser])
def upload_additional_photos(request):
    """
    POST multipart/form-data {
      "refresh": "<refresh_token>",
      "photo1": <file>,      # optional
      "photo2": <file>,      # optional
      "photo3": <file>       # optional
    }
    → validates refresh token, updates any of `user.photo1`–`user.photo3` provided.
    """
    refresh = request.data.get('refresh')
    if not refresh:
        return Response({'detail': 'Refresh token required.'},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        user = _get_user_from_refresh(refresh)
    except (TokenError, User.DoesNotExist):
        return Response({'detail': 'Invalid or expired token.'},
                        status=status.HTTP_401_UNAUTHORIZED)

    updated = []
    for field in ('photo1', 'photo2', 'photo3'):
        img = request.FILES.get(field)
        if img:
            setattr(user, field, img)
            updated.append(field)

    if not updated:
        return Response({'detail': 'No additional photos provided.'},
                            status=status.HTTP_400_BAD_REQUEST)

    user.save(update_fields=updated)
    return Response(
        {'detail': 'Updated photos: ' + ', '.join(updated)},
        status=status.HTTP_200_OK
    )


# Add this to api/views.py, below your other endpoints

@api_view(['POST'])
@permission_classes([AllowAny])
def update_bio(request):
    """
    POST JSON {
      "refresh": "<refresh_token>",
      "bio": "<new bio text>"
    }
    → validates refresh token, updates user.bio (creates or edits).
    """
    refresh = request.data.get('refresh')
    # We allow setting bio to an empty string, so check for presence rather than truthiness
    if 'bio' not in request.data:
        return Response({'detail': 'Bio text required.'},
                        status=status.HTTP_400_BAD_REQUEST)

    bio_text = request.data.get('bio')

    if not refresh:
        return Response({'detail': 'Refresh token required.'},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        user = _get_user_from_refresh(refresh)
    except (TokenError, User.DoesNotExist):
        return Response({'detail': 'Invalid or expired token.'},
                        status=status.HTTP_401_UNAUTHORIZED)

    user.bio = bio_text
    user.save(update_fields=['bio'])
    return Response({'detail': 'Bio updated.'},
                    status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def update_preferences(request):
    """
    POST JSON {
      "refresh": "<refresh_token>",
      "gender": "<M|F|O>",          # optional
      "location": "<city or text>", # optional
      "min_age": <integer>,         # optional
      "max_age": <integer>          # optional
      "pronouns": "<text>"            # optional
    }
    → validates refresh token, updates any of gender, location, min_age, max_age provided.
    """
    refresh = request.data.get('refresh')
    if not refresh:
        return Response({'detail': 'Refresh token required.'},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        user = _get_user_from_refresh(refresh)
    except (TokenError, User.DoesNotExist):
        return Response({'detail': 'Invalid or expired token.'},
                        status=status.HTTP_401_UNAUTHORIZED)

    updated = []

    # Gender
    if 'gender' in request.data:
        gender = request.data.get('gender')
        valid = [choice[0] for choice in User.GENDER_CHOICES]
        if gender not in valid:
            return Response(
                {'detail': f"'gender' must be one of {valid}."},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.gender = gender
        updated.append('gender')

    # Location
    if 'location' in request.data:
        user.location = request.data.get('location') or ''
        updated.append('location')

    # Age bounds
    def parse_int(field):
        try:
            return int(request.data[field])
        except (ValueError, TypeError):
            raise ValueError(f"'{field}' must be an integer.")

    if 'min_age' in request.data:
        try:
            min_age = parse_int('min_age')
        except ValueError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        user.min_age = min_age
        updated.append('min_age')

    if 'max_age' in request.data:
        try:
            max_age = parse_int('max_age')
        except ValueError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        user.max_age = max_age
        updated.append('max_age')

    # Validate bounds
    if user.min_age is not None and user.max_age is not None:
        if user.min_age > user.max_age:
            return Response(
                {'detail': "'min_age' cannot be greater than 'max_age'."},
                status=status.HTTP_400_BAD_REQUEST
            )

    if 'pronouns' in request.data:
        user.pronouns = request.data.get('pronouns') or ''
        updated.append('pronouns')

    if not updated:
        return Response({'detail': 'No preferences provided.'},
                        status=status.HTTP_400_BAD_REQUEST)

    user.save(update_fields=updated)
    return Response(
        {'detail': 'Preferences updated.', 'updated': updated},
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def swipe(request):
    """
    POST { "target_id": 42, "direction": "left"|"right" }
    → updates the target’s Elo.
    """
    swiper = request.user
    tid     = request.data.get('target_id')
    dirn    = request.data.get('direction')

    if dirn not in ('left','right') or not tid:
        return Response({'detail':'target_id + direction required.'},
                        status=status.HTTP_400_BAD_REQUEST)

    target = get_object_or_404(User, pk=tid)
    # don’t let users swipe on themselves
    if target == swiper:
        return Response({'detail':'Cannot swipe yourself.'},
                        status=status.HTTP_400_BAD_REQUEST)

    process_swipe(target, swiper, swiped_right=(dirn=='right'))
    return Response({'detail':'swipe recorded.'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def match(request):
    """
    POST { "user_id": 42 }
    → updates both users' Elo for a match event.
    """
    user_a = request.user
    user_b_id = request.data.get('user_id')
    if not user_b_id:
        return Response({'detail':'user_id required.'}, status=status.HTTP_400_BAD_REQUEST)
    user_b = get_object_or_404(User, pk=user_b_id)
    if user_a == user_b:
        return Response({'detail':'Cannot match yourself.'}, status=status.HTTP_400_BAD_REQUEST)
    process_match(user_a, user_b)
    return Response({'detail':'match recorded.'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unmatch(request):
    """
    POST { "user_id": 42 }
    → updates user A's Elo for an unmatch event (user B unmatches user A).
    """
    user_b = request.user
    user_a_id = request.data.get('user_id')
    if not user_a_id:
        return Response({'detail':'user_id required.'}, status=status.HTTP_400_BAD_REQUEST)
    user_a = get_object_or_404(User, pk=user_a_id)
    if user_a == user_b:
        return Response({'detail':'Cannot unmatch yourself.'}, status=status.HTTP_400_BAD_REQUEST)
    process_unmatch(user_a, user_b)
    return Response({'detail':'unmatch recorded.'})


# in api/views.py
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recommendations(request):
    """
    GET → returns a list of up to 10 users near your Elo.
    """
    recs = recommend_for(request.user)
    data = [{
        'id': u.id,
        'username': u.username,
        'elo': u.elo,
        # add any serialized fields you need…
    } for u in recs]
    return Response(data)

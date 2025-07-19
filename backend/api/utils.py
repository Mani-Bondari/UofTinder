# in api/utils.py (or wherever)
import random
from .models import User

def expected_score(rating_a, rating_b):
    return 1.0 / (1 + 10 ** ((rating_b - rating_a) / 400))

def update_elo_event(user_a, user_b, outcome, k):
    # user_a is the one whose ELO is being updated
    EA = expected_score(user_a.elo, user_b.elo)
    user_a.elo = round(user_a.elo + k * (outcome - EA))
    user_a.save(update_fields=['elo'])

def process_swipe(user_a, user_b, swiped_right):
    # user_b swipes on user_a
    # outcome = 1 if right, 0 if left
    outcome = 1 if swiped_right else 0
    k = 16
    update_elo_event(user_a, user_b, outcome, k)

def process_match(user_a, user_b):
    # Both users matched (swiped right on each other)
    outcome = 1
    k = 32
    update_elo_event(user_a, user_b, outcome, k)
    update_elo_event(user_b, user_a, outcome, k)

def process_unmatch(user_a, user_b):
    # user_b unmatches user_a, user_a gets outcome=0, k=32
    outcome = 0
    k = 32
    update_elo_event(user_a, user_b, outcome, k)

def recommend_for(user, limit=10):
    # Return up to `limit` users ordered by ELO closest to `user`
    qs = User.objects.exclude(pk=user.pk)
    # Annotate with abs diff, order by it
    users = list(qs)
    users.sort(key=lambda u: abs(u.elo - user.elo))
    return users[:limit]

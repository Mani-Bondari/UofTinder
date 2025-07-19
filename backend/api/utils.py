# in api/utils.py (or wherever)
import random
from .models import User


def update_elo(swiper, target, k=32, swipe_right=True):
    """
    Update `target.elo` based on a swipe by `swiper`.
    swipe_right=True  → treat as a “win” for `target`
    swipe_right=False → treat as a “loss” for `target`
    """
    # current ratings
    R_a, R_b = swiper.elo, target.elo

    # expected score for target (B)
    E_b = 1.0 / (1 + 10 ** ((R_a - R_b) / 400))

    # actual score
    S_b = 1.0 if swipe_right else 0.0

    # update target’s Elo
    target.elo = round(R_b + k * (S_b - E_b))
    target.save(update_fields=['elo'])


# in api/utils.py
import random

def recommend_for(user, range_pts=100, limit=10):
    """
    Return up to `limit` users whose Elo is within ±range_pts of `user`.
    """
    low, high = user.elo - range_pts, user.elo + range_pts
    qs = User.objects.filter(
        elo__gte=low,
        elo__lte=high
    ).exclude(pk=user.pk)

    # if you want a bit of randomness:
    candidates = list(qs)
    random.shuffle(candidates)
    return candidates[:limit]

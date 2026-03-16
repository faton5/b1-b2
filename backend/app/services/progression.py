from app import models


def get_current_level(levels: list[models.RpgLevel], xp: int) -> models.RpgLevel:
    current = levels[0]
    for level in levels:
        if xp >= level.min_xp:
            current = level
    return current


def get_next_level(levels: list[models.RpgLevel], xp: int) -> models.RpgLevel | None:
    for level in levels:
        if level.min_xp > xp:
            return level
    return None

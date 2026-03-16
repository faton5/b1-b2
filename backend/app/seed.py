from sqlalchemy import select

from app import models
from app.constants import DEFAULT_ACCOUNT_TIERS, DEFAULT_LEVELS, DEFAULT_QUESTS
from app.db import SessionLocal


def seed_reference_data() -> None:
    with SessionLocal() as db:
        existing_tiers = {tier.code for tier in db.scalars(select(models.AccountTier)).all()}
        for payload in DEFAULT_ACCOUNT_TIERS:
            if payload["code"] not in existing_tiers:
                db.add(models.AccountTier(**payload))

        existing_levels = {level.level for level in db.scalars(select(models.RpgLevel)).all()}
        for payload in DEFAULT_LEVELS:
            if payload["level"] not in existing_levels:
                db.add(models.RpgLevel(**payload))

        existing_quests = {quest.slug for quest in db.scalars(select(models.LearningQuest)).all()}
        for payload in DEFAULT_QUESTS:
            if payload["slug"] not in existing_quests:
                db.add(models.LearningQuest(**payload))

        db.commit()

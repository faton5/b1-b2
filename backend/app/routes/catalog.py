from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud, schemas
from app.db import get_db


router = APIRouter(tags=["catalog"])


@router.get("/account-tiers", response_model=list[schemas.AccountTierRead])
def read_account_tiers(db: Session = Depends(get_db)) -> list[schemas.AccountTierRead]:
    return crud.list_account_tiers(db)


@router.get("/levels", response_model=list[schemas.RpgLevelRead])
def read_levels(db: Session = Depends(get_db)) -> list[schemas.RpgLevelRead]:
    return crud.list_levels(db)


@router.get("/quests", response_model=list[schemas.QuestRead])
def read_quests(db: Session = Depends(get_db)) -> list[schemas.QuestRead]:
    return crud.list_quests(db)

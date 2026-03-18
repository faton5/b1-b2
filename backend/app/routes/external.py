from __future__ import annotations

import httpx
from fastapi import APIRouter, HTTPException


router = APIRouter(prefix="/external", tags=["external"])


JSONPLACEHOLDER_BASE_URL = "https://jsonplaceholder.typicode.com"


@router.get("/posts")
async def list_posts() -> list[dict]:
    """Retourne une liste de posts depuis l'API JSONPlaceholder."""
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(f"{JSONPLACEHOLDER_BASE_URL}/posts")
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=f"Erreur de connexion à JSONPlaceholder: {exc}") from exc

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"JSONPlaceholder a renvoyé un statut inattendu: {response.status_code}",
        )

    data = response.json()
    if not isinstance(data, list):
        raise HTTPException(status_code=502, detail="Réponse invalide de JSONPlaceholder.")

    return data


@router.get("/posts/{post_id}")
async def get_post(post_id: int) -> dict:
    """Retourne le détail d'un post spécifique depuis JSONPlaceholder."""
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(f"{JSONPLACEHOLDER_BASE_URL}/posts/{post_id}")
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=f"Erreur de connexion à JSONPlaceholder: {exc}") from exc

    if response.status_code == 404:
        raise HTTPException(status_code=404, detail="Post introuvable sur JSONPlaceholder.")

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"JSONPlaceholder a renvoyé un statut inattendu: {response.status_code}",
        )

    data = response.json()
    if not isinstance(data, dict):
        raise HTTPException(status_code=502, detail="Réponse invalide de JSONPlaceholder.")

    return data


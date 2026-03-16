from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import Base, engine
from app.routes.catalog import router as catalog_router
from app.routes.chat import router as chat_router
from app.routes.users import router as users_router
from app.seed import seed_reference_data


app = FastAPI(title="b1-b2 backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    seed_reference_data()


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(catalog_router)
app.include_router(users_router)
app.include_router(chat_router)

import os
import httpx
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, jwk
from jose.utils import base64url_decode

bearer = HTTPBearer()
CLERK_JWKS_URL = os.environ.get("CLERK_JWKS_URL")  # add to .env

def get_jwks():
    res = httpx.get(CLERK_JWKS_URL)
    return res.json()

def verify_clerk_token(
    credentials: HTTPAuthorizationCredentials = Security(bearer),
) -> dict:
    token = credentials.credentials
    try:
        jwks = get_jwks()
        header = jwt.get_unverified_header(token)
        key = next(k for k in jwks["keys"] if k["kid"] == header["kid"])
        public_key = jwk.construct(key)
        payload = jwt.decode(token, public_key, algorithms=["RS256"])
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
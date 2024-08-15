import firebase_admin
from firebase_admin import credentials, firestore, auth
import os
from fastapi import Depends, HTTPException, status

service_account_path = os.path.join(os.path.dirname(__file__), 'service-account.json')

if not firebase_admin._apps:
    try:
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        raise RuntimeError(f"Failed to initialize Firebase Admin SDK: {e}")

try:
    db = firestore.client()
except Exception as e:
    raise RuntimeError(f"Failed to initialize Firestore client: {e}")

def verify_firebase_token(id_token: str):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

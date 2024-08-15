import firebase_admin
from firebase_admin import credentials, firestore, auth
import os
from fastapi import HTTPException, status

service_account_path = os.path.join(os.path.dirname(__file__), 'service-account.json')

if not firebase_admin._apps:
    try:
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
        print("Firebase Admin SDK initialized successfully.")
    except Exception as e:
        raise RuntimeError(f"Failed to initialize Firebase Admin SDK: {e}")

try:
    db = firestore.client()
    print("Firestore client initialized successfully.")
except Exception as e:
    raise RuntimeError(f"Failed to initialize Firestore client: {e}")

def verify_firebase_token(id_token: str):
    try:
        decoded_token = auth.verify_id_token(id_token)
        print("Token verified successfully:", decoded_token)
        return decoded_token
    except Exception as e:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

from fastapi import Header, HTTPException
import jwt

def get_current_user_id(authorization: str = Header(...)) -> str:
    try:
        # Extraemos el token del formato "Bearer <token>"
        token = authorization.split(" ")[1]
        
 
        payload = jwt.decode(token, options={"verify_signature": False})
        
        # Buscamos el ID del usuario (usualmente en 'sub' o 'user_id')
        user_id = payload.get("sub") or payload.get("user_id")
        
        if not user_id:
             raise HTTPException(status_code=401, detail="Token inválido: falta user_id")
             
        return user_id
        
    except Exception:
        # Cualquier error de formato (no es un JWT real, está mal formado, etc.)
        raise HTTPException(status_code=401, detail="Token inválido")
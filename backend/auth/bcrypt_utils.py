from bcrypt import hashpw, gensalt, checkpw

def hash_password(password):
    return hashpw(password.encode(), gensalt()).decode()

def check_password(password, hashed):
    return checkpw(password.encode(), hashed.encode())

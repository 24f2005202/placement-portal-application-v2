class Config():
    DEBUG= True

    # SQLALCHEMY
    SQLALCHEMY_TRACK_MODIFICATIONS= True
    SQLALCHEMY_DATABASE_URI = "sqlite:///ppa.db"

    # Security
    SECRET_KEY = "this-is-a-secret-key"                         # hash user creds in session
    SECURITY_PASSWORD_HASH = "bcrypt"                           # mechanism for hashing password
    SECURITY_PASSWORD_SALT = "this-is-a-password-salt"          # helps in hashing in password
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"

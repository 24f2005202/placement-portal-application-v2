#Initial commit
from flask import Flask
from application.config import Config
from application.database import db
from application.models import User, Role  # IMPORT ROLES AND OTHERS
from application.routes import bp
from flask_security import Security, SQLAlchemyUserDatastore
from flask_security import hash_password

app=Flask(__name__)
app.config.from_object(Config)
app.register_blueprint(bp)                         #app.register_blueprint(bp, url_prefix="/")
db.init_app(app)
datastore = SQLAlchemyUserDatastore(db, User, Role)
app.security = Security(app, datastore)

with app.app_context():
    db.create_all()

    app.security.datastore.find_or_create_role(name = "admin", description="Superuser of the app")
    app.security.datastore.find_or_create_role(name = "company", description="Company who offer opportunities")
    app.security.datastore.find_or_create_role(name = "student", description="Student of the Institution")

    db.session.commit()

    if not app.security.datastore.find_user(email = "admin0@ppa.com"):
        app.security.datastore.create_user(email="admin0@ppa.com", password = hash_password("1234"), roles = ['admin'])

    if not app.security.datastore.find_user(email = "company0@ppa.com"):
        app.security.datastore.create_user(email="company0@ppa.com", password = hash_password("1234"), roles = ['company'])


    if not app.security.datastore.find_user(email = "student0@ppa.com"):
        app.security.datastore.create_user(email="student0@ppa.com", password = hash_password("1234"), roles = ['student'])

    db.session.commit()

if __name__ == "__main__":
    app.run()

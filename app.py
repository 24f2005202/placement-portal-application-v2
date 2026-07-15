#Initial commit
from flask import Flask
from application.config import Config
from application.database import db
from application.models import User, Role , Company, Student # IMPORT ROLES AND OTHERS
from application.routes import bp
from flask_security import Security, SQLAlchemyUserDatastore
from flask_security import hash_password

# cacheing-----------------------------------
from application.cache import cache
# cacheing-----------------------------------

app=Flask(__name__)
app.config.from_object(Config)
app.register_blueprint(bp)                         #app.register_blueprint(bp, url_prefix="/")
db.init_app(app)
datastore = SQLAlchemyUserDatastore(db, User, Role)
app.security = Security(app, datastore)

# cacheing-----------------------------------
app.config["CACHE_TYPE"] = "RedisCache"
app.config["CACHE_REDIS_HOST"] = "localhost"
app.config["CACHE_REDIS_PORT"] = 6379
app.config["CACHE_DEFAULT_TIMEOUT"] = 60

cache.init_app(app)
# cacheing-----------------------------------

with app.app_context():
    db.create_all()

    app.security.datastore.find_or_create_role(name = "admin", description="Superuser of the app")
    app.security.datastore.find_or_create_role(name = "company", description="Company who offer opportunities")
    app.security.datastore.find_or_create_role(name = "student", description="Student of the Institution")

    db.session.commit()

    if not app.security.datastore.find_user(email = "admin0@ppa.com"):
        app.security.datastore.create_user(email="admin0@ppa.com", password = hash_password("1234"), roles = ['admin'])

    if not app.security.datastore.find_user(email = "company0@ppa.com"):
        new_user_2=app.security.datastore.create_user(email="company0@ppa.com", password = hash_password("1234"), roles = ['company'])


    if not app.security.datastore.find_user(email = "student0@ppa.com"):
        new_user_3=app.security.datastore.create_user(email="student0@ppa.com", password = hash_password("1234"), roles = ['student'])

    db.session.commit()

    # adding company and student test data

    new_user_2 = app.security.datastore.find_user(email="company0@ppa.com")
    new_user_3 = app.security.datastore.find_user(email="student0@ppa.com")

    if not Company.query.filter_by(user_id=new_user_2.id).first():
        new_company= Company(name="Company0", user_id=new_user_2.id, website_url="http://127.0.0.1:5000/", industry_type="IT", location="Banglore, India", hr_contact_number="+919876543210", hr_email="company0@ppa.com",company_description="Test Company")
        db.session.add(new_company)

    if not Student.query.filter_by(user_id=new_user_3.id).first():
        new_student= Student(name="Student0",user_id=new_user_3.id, course="BTECH-ECE", batch_year="2028", current_cgpa=9.2, phone_no="+919876543210", resume_link="https://template.canva.com/EAGmJ13p8zE/1/0/566w-pl4Tp3Rqk2c.jpg" )
        db.session.add(new_student)
    
    db.session.commit()
    


if __name__ == "__main__":
    app.run()

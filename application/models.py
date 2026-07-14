from .database import db
from flask_security import UserMixin, RoleMixin
from sqlalchemy import JSON
from datetime import date


#---------------------- RBAC Models ------------------------

class User(db.Model, UserMixin):
    id= db.Column(db.Integer, primary_key =True)
    email= db.Column(db.String, unique=True, nullable=False)
    password= db.Column(db.String, nullable=False)
    fs_uniquifier= db.Column(db.String, unique=True, nullable=False)
    active= db.Column(db.Boolean, nullable= False)
    
    # Many to Many with Role
    roles= db.relationship("Role", backref= "bearer", secondary= "user_roles")                   # BECAUSE UserRoles is converted to user_roles in table name
    
    # One to One with Student, Company                                                    # user table main se patient or doctor table ko access karne ke liye, 
    student= db.relationship('Student', backref='user', uselist=False, cascade='all, delete-orphan')                    # agar uselist=False nhi karege to user-students main one to many relation banega to hamko user.student[0].name karna padega, par uselist=False se one to one relationship banegi to user.student.name work karega    
    company= db.relationship('Company', backref='user',uselist=False, cascade='all, delete-orphan')

    # is_verified= db.Column(db.Boolean, nullable= False, default=True)              #use it to prevent company to login until admin verify them

class Role(db.Model, RoleMixin):
    id= db.Column(db.Integer, primary_key =True)
    name= db.Column(db.String, unique=True, nullable= False)
    description= db.Column(db.String)

class UserRoles(db.Model):
    id= db.Column(db.Integer, primary_key =True)
    user_id= db.Column(db.Integer, db.ForeignKey("user.id"))
    role_id= db.Column(db.Integer, db.ForeignKey("role.id"))



#------------------------------- Other Models -------------------------------------

class Student(db.Model):
    id= db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String, nullable=False)
    course=db.Column(db.String, nullable=False)
    # department=db.Column(db.String, nullable=False)
    batch_year=db.Column(db.String, nullable=False)          # graduation year
    current_cgpa = db.Column(db.Float, nullable=False)
    phone_no =db.Column(db.String)
    resume_link =db.Column(db.String)

    user_id= db.Column(db.Integer, db.ForeignKey("user.id"), unique=True, nullable=False)         # unique=True makes relationship one to one at database level

    # Oneto Many relation
    applications= db.relationship('Application', backref='student', cascade='all, delete-orphan')
    placements= db.relationship('Placement', backref='student')

class Company(db.Model):
    id= db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String, nullable=False)
    website_url=db.Column(db.String, nullable=False)
    industry_type =db.Column(db.String, nullable=False)               # IT, Finance, Core Engineering, etc
    location=db.Column(db.String, nullable=False)                     # City, Country
    hr_contact_number=db.Column(db.String, nullable=False)              # +91 9876543210
    hr_email=db.Column(db.String, nullable=False)
    company_description=db.Column(db.String, nullable=False)
    # approval_status = db.Column(db.Boolean, nullable= False, default=False)

    user_id= db.Column(db.Integer, db.ForeignKey("user.id"), unique=True)

    # Oneto Many relation
    placement_drives= db.relationship('PlacementDrive', backref='company', cascade='all, delete-orphan')
    placements= db.relationship('Placement', backref='company')

class PlacementDrive(db.Model):
    id= db.Column(db.Integer, primary_key=True)
    job_title= db.Column(db.String, nullable=False)
    job_description= db.Column(db.String, nullable=False)
    status = db.Column(db.String, nullable=False, default="Pending")                     # no use bcs approved companys' all drives are automaticly approved # Pending / Approved / Closed (closed na bhi rakhne aur deadline se chek kar sakte hai)
    deadline = db.Column(db.Date)                                     # dd/mm/yyyy
    eligible_branches = db.Column(JSON, nullable=False)
    eligible_passing_years = db.Column(JSON, nullable=False)
    eligible_minimum_cgpa = db.Column(db.Float, nullable=False)
    salary=db.Column(db.Float)
    jd_link=db.Column(db.String, nullable=False)
    # interview_mode=db.Column(db.String)            #In-person/Online


    company_id= db.Column(db.Integer,  db.ForeignKey("company.id"), nullable=False)

    # Oneto Many relation
    applications= db.relationship('Application', backref='placement_drive')

    # e_course = db.Column(db.String)                                  # Eligibility Criteria
    # e_department = db.Column(db.String)
    # e_batch_year = db.Column(db.String)          
    # e_cgpa = db.Column(db.Float)


class Application(db.Model):
    id= db.Column(db.Integer, primary_key=True)

    student_id= db.Column(db.Integer, db.ForeignKey("student.id"), nullable=False)
    drive_id= db.Column(db.Integer, db.ForeignKey("placement_drive.id"), nullable=False)                    # SQLAlchemy converts CamelCase class names to snake_case table names, Placement_Drive TO Placement_Drive
    
    application_date = db.Column(db.Date, default=date.today)  
    status = db.Column(db.String, default="applied")                     # applied / shortlisted / interview_scheduled / interview_completed / selected / rejected 

    interviews = db.relationship("Interview", backref="application", cascade="all, delete-orphan")


class Interview(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    application_id = db.Column(db.Integer, db.ForeignKey("application.id"), nullable=False)

    round_name = db.Column(db.String, nullable=False)          # HR, Technical, Aptitude
    interview_mode = db.Column(db.String, nullable=False)            # Online / Offline

    interview_date = db.Column(db.Date, nullable=False)
    interview_time = db.Column(db.Time, nullable=False)

    interview_location_or_meeting_link = db.Column(db.String)                        # room 201
    # meeting_link = db.Column(db.String)                            # gmeet link

    remarks = db.Column(db.String)

    status = db.Column(db.String, default="scheduled")   # scheduled, completed, cancelled

    
class Placement(db.Model):
    id= db.Column(db.Integer, primary_key=True)

    student_id= db.Column(db.Integer, db.ForeignKey("student.id"), nullable=False)
    company_id= db.Column(db.Integer, db.ForeignKey("company.id"), nullable=False)

    position = db.Column(db.String, nullable=False)
    salary = db.Column(db.Float)        
    joining_date= db.Column(db.Date)  
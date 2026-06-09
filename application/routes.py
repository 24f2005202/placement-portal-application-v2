from flask import Blueprint, jsonify, request, current_app, render_template
from .database import db 
from .models import User, Role, Student, Company, PlacementDrive, Application,Placement
from flask_security import auth_required, roles_required, current_user,  hash_password, verify_password
from .utils import roles_list
from werkzeug.security import check_password_hash, generate_password_hash

bp= Blueprint("bp", __name__, template_folder='../templates', static_folder='../static')

@bp.route("/")
def home():
    return render_template('index.html')

@bp.route("/api/login", methods=["POST"])
def login_User():
    body=request.get_json()
    email=body["email"]
    password=body["password"]

    if not email or not password:
        return jsonify({"message": "email and password are required"}), 400

    user=current_app.security.datastore.find_user(email=email)

    if not user:
        return jsonify({"message": "User not found"}), 404

    if verify_password(password,user.password):
        user_roles= roles_list(user.roles)
        return jsonify({
                    "auth_token": user.get_auth_token(),
                    "id": user.id,
                    "role": user_roles[0]
                })
    else:
        return jsonify({"message": "Incorrect password"}), 400
    

@bp.route("/api/user_data")
@auth_required('token') # Authentication
def user_data():
    return jsonify(
        {
            "id": current_user.id,
            "email": current_user.email
        }
    )



#----------------------------------------- Admin routes ---------------------------

# @bp.route("/api/login_admin", methods=["POST"])
# def login_admin():
#     body=request.get_json()
#     email=body["email"]
#     password=body["password"]

#     if not email or not password:
#         return jsonify({"message": "email and password are required"}), 400

#     user=current_app.security.datastore.find_user(email=email)

#     if not user:
#         return jsonify({"message": "User not found"}), 404

#     if verify_password(password,user.password):
#         return jsonify({
#                     "auth_token": user.get_auth_token(),
#                     "id": user.id
#                 })
#     else:
#         return jsonify({"message": "Incorrect password"}), 400




@bp.route('/admin', methods = ['GET'])
@auth_required('token')
@roles_required('admin')
def admin_dasboard():
    return jsonify(
        {
            "message": f"Admin dasboard, Welcome {current_user.email} to dashboard"
        }
    )
#----------------------------------------- Company routes ---------------------------

@bp.route("/api/register_company", methods=["POST"])
def register_company():
    body=request.get_json()

    if not body:
        return jsonify({"message": "No data provided"}), 400
    
    email    = body["email"]
    password = body["password"]

    name = body["name"]
    website_url = body["website_url"]
    industry_type = body["industry_type"]
    location = body["location"]
    hr_contact_number = body["hr_contact_number"]
    hr_email = body["hr_email"]
    company_description = body["company_description"]
    

    if not email or not password or not name or not website_url or not industry_type or not location or not hr_contact_number or not hr_email:
        return jsonify({"message": "All fields are required"}), 400

    if current_app.security.datastore.find_user(email=email):
        return jsonify({"message" : "User already exists"}), 400
    
    new_user= current_app.security.datastore.create_user(
                email=email,
                password=hash_password(password),
                roles = ['company']
            )
    db.session.commit()

    # new_patient = Patient(user_id=new_user.id, name=name)
    # db.session.add(new_patient)
    # db.session.commit()

    new_company= Company(name=name, user_id=new_user.id, website_url=website_url, industry_type=industry_type, location=location, hr_contact_number=hr_contact_number, hr_email=hr_email,company_description=company_description)
    db.session.add(new_company)
    db.session.commit()


    return jsonify({"message": "Company registered successfully"})


# @bp.route("/api/login_company", methods=["POST"])
# def login_company():
#     body=request.get_json()
#     email=body["email"]
#     password=body["password"]

#     if not email or not password:
#         return jsonify({"message": "email and password are required"}), 400

#     user=current_app.security.datastore.find_user(email=email)

#     if not user:
#         return jsonify({"message": "User not found"}), 404

#     if verify_password(password,user.password):
#         return jsonify({
#                     "auth_token": user.get_auth_token(),
#                     "id": user.id
#                 })
#     else:
#         return jsonify({"message": "Incorrect password"}), 400




@bp.route('/company', methods = ['GET'])
@auth_required('token')
@roles_required('company')
def company_dasboard():
    return jsonify(
        {
            "message": f"Company Dashboard, This is {current_user.email} dashboard, password is {current_user.password}"
        }
    )


#----------------------------------------- Students routes ---------------------------

@bp.route("/api/register_student", methods=["POST"])
def register_student():
    body=request.get_json()

    if not body:
        return jsonify({"message": "No data provided"}), 400
    
    email    = body["email"]
    password = body["password"]

    name = body["name"]
    course = body["course"]
    department = body["department"]
    batch_year = body["batch_year"]
    current_cgpa =float(body["current_cgpa"]) 
    phone_no = body["phone_no"]
    resume_link = body["resume_link"]

    

    if not email or not password or not name or not course  or not department or not batch_year or not current_cgpa or not phone_no or not resume_link :
        return jsonify({"message": "All fields are required"}), 400

    if current_app.security.datastore.find_user(email=email):
        return jsonify({"message" : "User already exists"}), 400
    
    new_user= current_app.security.datastore.create_user(
        email=email,
        password=hash_password(password),
        roles = ['student']
    )
    db.session.commit()

    new_student= Student(name=name,user_id=new_user.id, course=course, department=department, batch_year=batch_year, current_cgpa=current_cgpa, phone_no=phone_no, resume_link=resume_link )
    db.session.add(new_student)
    db.session.commit()

    return jsonify({"message": "Student registered successfully"})


# @bp.route("/api/login_student", methods=["POST"])
# def login_student():
#     body=request.get_json()
#     email=body["email"]
#     password=body["password"]

#     if not email or not password:
#         return jsonify({"message": "email and password are required"}), 400

#     user=current_app.security.datastore.find_user(email=email)

#     if not user:
#         return jsonify({"message": "User not found"}), 404

#     if verify_password(password,user.password):
#         return jsonify({
#                     "auth_token": user.get_auth_token(),
#                     "id": user.id
#                 })
#     else:
#         return jsonify({"message": "Incorrect password"}), 400


@bp.route('/student', methods = ['GET'])                    #dashboard
@auth_required('token')
@roles_required('student')
def student_dasboard():
    return jsonify(
        {
            "message": f"Student Dashboard, This is {current_user.email} dashboard"
        }
    )
from flask import Blueprint, jsonify, request, current_app, render_template
from .database import db 
from .models import User, Role, Student, Company, PlacementDrive, Application,Placement
from flask_security import auth_required, roles_required, current_user,  hash_password, verify_password
from .utils import roles_list, company_applications_list, registered_company_list
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import date
from datetime import datetime


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
    
    if not user.active:                              
        return jsonify({"message": "Account is not active, if you are a company and registered just now, please wait some time, admisistration will verify your account soon."}), 403

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


@bp.route('/api/admin/overview')
@auth_required('token')
@roles_required('admin')
def admin_overview():
    student_count = len(Student.query.all())
    registered_company_count = len(registered_company_list(Company.query.all()))
    placement_drive_count = len(PlacementDrive.query.all())
    company_applications_count = len(company_applications_list(Company.query.all()))


    # all_students = Student.query.all()
    # all_companies = Company.query.all()
    # all_placement_drives = PlacementDrive.query.all()

    # company_applications= []
    # for company in all_companies:
    #     if company.user.active == False:
    #         company_applications.append(company)
    
    return jsonify({
        "student_count": student_count,
        "company_count": registered_company_count,
        "placement_drive_count": placement_drive_count,
        "company_applications_count": company_applications_count

        # "all_students": all_students,
        # "all_companies": all_companies,
        # "all_placement_drives": all_placement_drives,

        # "company_applications": company_applications
    })

@bp.route('/api/admin/registered_students')
@auth_required('token')
@roles_required('admin')
def registered_students():
    students = Student.query.all()
    student_list = []
    
    for student in students:

        applications = Application.query.filter_by(student_id=student.id).all()
        applications_list = []
        for application in applications:
            applications_list.append({
                "application_id": application.id,
                "placement_drive_id": application.placement_drive.id,
                "placement_drive_job_title": application.placement_drive.job_title,
                "status": application.status
            })
        student_list.append({
            "id": student.id,
            "name": student.name,
            "course": student.course,
            "batch_year": student.batch_year,
            "current_cgpa": student.current_cgpa,
            "phone_no": student.phone_no,
            "resume_link": student.resume_link,
            "applications":applications_list
        })
    return jsonify(student_list)
    

@bp.route('/api/admin/registered_companies')
@auth_required('token')
@roles_required('admin')
def registered_companies():
    companies = Company.query.all()
    company_list = []
    for company in companies:
        if company.user.active == True:
            company_list.append({
                "id": company.id,
                "name": company.name,
                "website_url": company.website_url,
                "industry_type": company.industry_type,
                "location": company.location,
                "hr_contact_number": company.hr_contact_number,
                "hr_email": company.hr_email,
                "company_description": company.company_description,
                

            })
    return jsonify(company_list)


@bp.route('/api/admin/ongoing_placement_drives')
@auth_required('token')
@roles_required('admin')
def ongoing_placement_drives():
    drives = PlacementDrive.query.all()
    drive_list = []
    for drive in drives:
        drive_list.append({
            "id": drive.id,
            "name": drive.job_title
        })
    return jsonify(drive_list)


@bp.route('/api/admin/company_applications')
@auth_required('token')
@roles_required('admin')
def company_applications():
    companies = Company.query.all()
    company_list = []
    for company in companies:
        if company.user.active == False:
            company_list.append({
                "id": company.id,
                "name": company.name,
                "website_url": company.website_url,
                "industry_type": company.industry_type,
                "location": company.location,
                "hr_contact_number": company.hr_contact_number,
                "hr_email": company.hr_email,
                "company_description": company.company_description,
                

            })
    return jsonify(company_list)
    # companies = Company.query.all()
    # company_list = []
    # for company in companies:
    #     if company.user.active == False:
    #         company_list.append({
    #             "id": company.id,
    #             "name": company.name
    #         })
    # return jsonify(company_list)
    

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
                roles = ['company'],
                active= False                         # 
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


# @bp.route('/api/company/overview')
# @auth_required('token')
# @roles_required('company')
# def company_overview():
#     ongoing_placement_drive_count = len(PlacementDrive.query.filter_by(company_id=current_user.id and PlacementDrive.deadline >= date.today()).all())
#     closed_placement_drive_count = len(PlacementDrive.query.filter(company_id=current_user.id and PlacementDrive.deadline < date.today()).all())

#     return jsonify({
#         "ongoing_placement_drive_count": ongoing_placement_drive_count,
#         "closed_placement_drive_count": closed_placement_drive_count

#         # "all_students": all_students,
#         # "all_companies": all_companies,
#         # "all_placement_drives": all_placement_drives,

#         # "company_applications": company_applications
#     })

@bp.route('/api/company/overview')
@auth_required('token')
@roles_required('company')
def company_overview():

    ongoing_placement_drive_count = PlacementDrive.query.filter(
        PlacementDrive.company_id == current_user.id,
        PlacementDrive.deadline >= date.today()
    ).count()

    closed_placement_drive_count = PlacementDrive.query.filter(
        PlacementDrive.company_id == current_user.id,
        PlacementDrive.deadline < date.today()
    ).count()

    return jsonify({
        "ongoing_placement_drive_count": ongoing_placement_drive_count,
        "closed_placement_drive_count": closed_placement_drive_count
    })

@bp.route("/api/company/create_placement_drive", methods=["POST"])
@roles_required('company')
def create_drive():
    body=request.get_json()

    if not body:
        return jsonify({"message": "No data provided"}), 400
    
    job_title = body["job_title"]
    job_description = body["job_description"]
    eligible_minimum_cgpa = float(body["eligible_minimum_cgpa"])
    deadline = datetime.strptime(body["deadline"], "%Y-%m-%d").date()
    eligible_branches = body["eligible_branches"]
    eligible_passing_years = body["eligible_passing_years"]

    if not job_title or not job_description or not eligible_minimum_cgpa or not deadline:
        return jsonify({"message": "All fields are required"}), 400

    new_drive= PlacementDrive(job_title=job_title, job_description=job_description, eligible_minimum_cgpa=eligible_minimum_cgpa, deadline=deadline, company_id=current_user.id, eligible_branches=eligible_branches.split(","), eligible_passing_years=eligible_passing_years.split(","))
    db.session.add(new_drive)
    db.session.commit()

    return jsonify({"message": "Placement drive created successfully"})

@bp.route('/api/company/ongoing_placement_drives')
@auth_required('token')
@roles_required('company')
def company_ongoing_placement_drives():
    ongoing_placement_drives = PlacementDrive.query.filter(
        PlacementDrive.company_id == current_user.id,
        PlacementDrive.deadline > date.today()
    ).all()

    drive_list = []
    for drive in ongoing_placement_drives:
        drive_list.append({
            "id": drive.id,
            "job_title": drive.job_title,
            "job_description": drive.job_description,
            "eligible_minimum_cgpa": drive.eligible_minimum_cgpa,
            "deadline": drive.deadline,
            "status": "Ongoing" if drive.deadline >= date.today() else "Closed",
            "eligible_branches": drive.eligible_branches,
            "eligible_passing_years": drive.eligible_passing_years
        })

    return jsonify(drive_list)

@bp.route('/api/company/closed_placement_drives')
@auth_required('token')
@roles_required('company')
def company_closed_placement_drives():
    closed_placement_drives = PlacementDrive.query.filter(
        PlacementDrive.company_id == current_user.id,
        PlacementDrive.deadline <= date.today()
    ).all()

    drive_list = []
    for drive in closed_placement_drives:
        drive_list.append({
            "id": drive.id,
            "job_title": drive.job_title,
            "job_description": drive.job_description,
            "eligible_minimum_cgpa": drive.eligible_minimum_cgpa,
            "deadline": drive.deadline,
            "status": "Closed",
            "eligible_branches": drive.eligible_branches,
            "eligible_passing_years": drive.eligible_passing_years
        })

    return jsonify(drive_list)


@bp.route('/api/company/drive/<int:drive_id>')
@auth_required('token')
@roles_required('company')
def company_placement_drive(drive_id):
    drive = PlacementDrive.query.get(drive_id)
    if not drive:
        return jsonify({"message": "Drive not found"}), 404

    applications=drive.applications
    applications_list=[]
    for application in applications:
        applications_list.append(
            {"application_id": application.id},
            {"student_id": application.student.id},
            {"name": application.student.name},
        )

    return jsonify({
        "id": drive.id,
        "job_title": drive.job_title,
        "job_description": drive.job_description,
        "eligible_minimum_cgpa": drive.eligible_minimum_cgpa,
        "deadline": drive.deadline,
        "status": "Ongoing" if drive.deadline >= date.today() else "Closed",
        "eligible_branches": drive.eligible_branches,
        "eligible_passing_years": drive.eligible_passing_years,
        "applications": applications_list
    })

@bp.route('/api/company/profile')
@auth_required('token')
@roles_required('company')
def company_profile():
    user=User.query.get(current_user.id)
    company=user.company

    placement_drives=company.placement_drives
    return jsonify({
        "id": company.id,
        "company_name": company.name,
        "company_website_url": company.website_url,
        "company_industry_type": company.industry_type,
        "company_location": company.location,
        "company_hr_contact_number": company.hr_contact_number,
        "company_hr_email": company.hr_email,
        "company_description": company.company_description,
        "placement_drives": company.placement_drives,
    })
        

# @bp.route('/api/company/ongoing_placement_drives')
# @auth_required('token')
# @roles_required('company')
# def ongoing_placement_drives():
#     drives = PlacementDrive.query.filter(PlacementDrive.deadline >= date.today() and PlacementDrive.company_id == current_user.id).all()
#     drive_list = []
#     for drive in drives:
#         drive_list.append({
#             "id": drive.id,
#             "name": drive.job_title
#         })
#     return jsonify(drive_list)

# @bp.route('/api/company/ongoing_placement_drives')
# @auth_required('token')
# @roles_required('company')
# def ongoing_placement_drives():
#     drives = PlacementDrive.query.filter(PlacementDrive.deadline >= date.today() and PlacementDrive.company_id == current_user.id).all()
#     drive_list = []
#     for drive in drives:
#         drive_list.append({
#             "id": drive.id,
#             "name": drive.name
#         })
#     return jsonify(drive_list)


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
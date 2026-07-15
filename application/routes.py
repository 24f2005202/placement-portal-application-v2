from flask import Blueprint, jsonify, request, current_app, render_template
from .database import db 
from .models import User, Role, Student, Company, PlacementDrive, Application,Placement, Interview
from flask_security import auth_required, roles_required, current_user,  hash_password, verify_password
from .utils import roles_list, company_applications_list, registered_company_list
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import date
from datetime import datetime
from .cache import cache


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
@cache.cached(timeout=300)
def registered_students():
    students = Student.query.all()
    student_list = []
    
    for student in students:
        if student.user.active:

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
    
@bp.route('/api/admin/deactivated_students')
@auth_required('token')
@roles_required('admin')
def deactivated_students():
    students = Student.query.all()
    student_list = []
    
    for student in students:
        if not student.user.active:

            student_list.append({
                "id": student.id,
                "name": student.name,
                "course": student.course,
                "batch_year": student.batch_year,
                "current_cgpa": student.current_cgpa,
                "phone_no": student.phone_no,
                "resume_link": student.resume_link,
            })
    return jsonify(student_list)
    

@bp.route('/api/admin/registered_companies')
@auth_required('token')
@roles_required('admin')
def registered_companies():
    registered_company= registered_company_list( Company.query.all())
    # companies = Company.query.all()
    company_list = []
    for company in registered_company:
    #     if company.user.active == True:
        if company.user.active:
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

@bp.route('/api/admin/deactivated_companies')
@auth_required('token')
@roles_required('admin')
def deactivated_companies():
    compannies= Company.query.all()
    # companies = Company.query.all()
    company_list = []
    for company in compannies:
    #     if company.user.active == True:
        if not company.user.active:
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

    drives = PlacementDrive.query.filter(
        PlacementDrive.deadline >= date.today()
    ).all()

    drive_list = []

    for drive in drives:
        drive_list.append({
            "id": drive.id,
            "job_title": drive.job_title,
            "job_description": drive.job_description,
            "company_id": drive.company.id,
            "company_name": drive.company.name,
            "status": drive.status,
            "deadline": drive.deadline.strftime("%d-%m-%Y") if drive.deadline else None,
            "salary": drive.salary,
            "eligible_branches": drive.eligible_branches,
            "eligible_passing_years": drive.eligible_passing_years,
            "eligible_minimum_cgpa": drive.eligible_minimum_cgpa,
            "application_count": len(drive.applications),
            "jd_link": drive.jd_link
        })

    return jsonify(drive_list), 200

from datetime import date

@bp.route('/api/admin/closed_placement_drives')
@auth_required('token')
@roles_required('admin')
def closed_placement_drives():

    drives = PlacementDrive.query.filter(
        PlacementDrive.deadline < date.today()
    ).all()

    drive_list = []

    for drive in drives:
        drive_list.append({
            "id": drive.id,
            "job_title": drive.job_title,
            "job_description": drive.job_description,
            "company_id": drive.company.id,
            "company_name": drive.company.name,
            "status": drive.status,
            "deadline": drive.deadline.strftime("%d-%m-%Y") if drive.deadline else None,
            "salary": drive.salary,
            "eligible_branches": drive.eligible_branches,
            "eligible_passing_years": drive.eligible_passing_years,
            "eligible_minimum_cgpa": drive.eligible_minimum_cgpa,
            "application_count": len(drive.applications),
            "jd_link": drive.jd_link
        })

    return jsonify(drive_list), 200

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


@bp.route('/api/admin/deactivate_student/<int:student_id>', methods=['PUT'])
@auth_required('token')
@roles_required('admin')
def deactivate_student(student_id):

    student = Student.query.get(student_id)

    if student is None:
        return jsonify({"message": "Student not found"}), 404

    if not student.user.active:
        return jsonify({"message": "Student is already inactive."}), 400

    student.user.active = False
    db.session.commit()

    return jsonify({
        "message": "Student deactivated successfully."
    })

@bp.route('/api/admin/deactivate_company/<int:company_id>', methods=['PUT'])
@auth_required('token')
@roles_required('admin')
def deactivate_company(company_id):

    company = Company.query.get(company_id)

    if company is None:
        return jsonify({"message": "Company not found"}), 404

    if not company.user.active:
        return jsonify({"message": "Company is already inactive."}), 400

    company.user.active = False
    db.session.commit()

    return jsonify({
        "message": "Company deactivated successfully."
    })

@bp.route('/api/admin/activate_student/<int:student_id>', methods=['PUT'])
@auth_required('token')
@roles_required('admin')
def activate_student(student_id):

    student = Student.query.get(student_id)

    if student is None:
        return jsonify({"message": "Student not found"}), 404

    if student.user.active:
        return jsonify({"message": "Student is already active."}), 400

    student.user.active = True
    db.session.commit()

    return jsonify({
        "message": "Student activated successfully."
    })

@bp.route('/api/admin/activate_company/<int:company_id>', methods=['PUT'])
@auth_required('token')
@roles_required('admin')
def activate_company(company_id):

    company = Company.query.get(company_id)

    if company is None:
        return jsonify({"message": "Company not found"}), 404

    if company.user.active:
        return jsonify({"message": "Company is already active."}), 400

    company.user.active = True
    db.session.commit()

    return jsonify({
        "message": "Company activated successfully."
    }), 200
    


@bp.route('/api/admin/student_applications')
@auth_required('token')
@roles_required('admin')
def admin_applications():

    applications = Application.query.all()

    application_list = []

    for application in applications:

        application_list.append({
            "id": application.id,

            "student_id": application.student.id,
            "student_name": application.student.name,

            "drive_id": application.placement_drive.id,
            "job_title": application.placement_drive.job_title,

            "company_id": application.placement_drive.company.id,
            "company_name": application.placement_drive.company.name,

            "application_date": application.application_date.strftime("%d-%m-%Y")
                if application.application_date else None,

            "status": application.status,

            "student_course": application.student.course,
            "student_batch": application.student.batch_year,
            "student_cgpa": application.student.current_cgpa,

            "resume_link": application.student.resume_link
        })

    return jsonify(application_list)

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
        PlacementDrive.company_id == current_user.company.id,
        PlacementDrive.deadline >= date.today()
    ).count()

    closed_placement_drive_count = PlacementDrive.query.filter(
        PlacementDrive.company_id == current_user.company.id,
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
    salary=float(body["salary"])
    jd_link=body["jd_link"]

    if not job_title or not job_description or not eligible_minimum_cgpa or not deadline:
        return jsonify({"message": "All fields are required"}), 400

    new_drive= PlacementDrive(job_title=job_title, job_description=job_description, eligible_minimum_cgpa=eligible_minimum_cgpa, deadline=deadline, company_id=current_user.company.id, eligible_branches=eligible_branches.split(","), eligible_passing_years=eligible_passing_years.split(","), salary=salary, jd_link=jd_link)
    db.session.add(new_drive)
    db.session.commit()

    return jsonify({"message": "Placement drive created successfully"})

@bp.route('/api/company/ongoing_placement_drives')
@auth_required('token')
@roles_required('company')
def company_ongoing_placement_drives():
    ongoing_placement_drives = PlacementDrive.query.filter(
        PlacementDrive.company_id == current_user.company.id,
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
        PlacementDrive.company_id == current_user.company.id,
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
            {"application_id": application.id,
            "student_id": application.student.id,
            "name": application.student.name,
            "course": application.student.course,
            "batch_year": application.student.batch_year,
            "current_cgpa": application.student.current_cgpa,
            "resume_link": application.student.resume_link,
            "phone_no": application.student.phone_no,
            "status": application.status},                         # applied / shortlisted / interview_scheduled / interview_completed / selected / rejected 
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
    })



@bp.route('/api/company/shortlist/<int:application_id>', methods=['PATCH'])
@auth_required('token')
@roles_required('company')
def company_shortlist_application(application_id):

    application = Application.query.get(application_id)

    if application is None:
        return jsonify({"message": "Application not found"}), 404

    if application.placement_drive.company.user.id != current_user.id:
        return jsonify({"message": "You are not authorized to shortlist this application"}), 403

    application.status = "shortlisted"
    db.session.commit()

    return jsonify({
        "message": "Application shortlisted successfully",
        "application_id": application.id,
        "status": application.status
    }), 200


@bp.route('/api/company/schedule_interview/<int:application_id>', methods=['POST'])
@auth_required('token')
@roles_required('company')
def schedule_interview(application_id):

    application = Application.query.get(application_id)

    if application is None:
        return jsonify({"message": "Application not found"}), 404

    if application.placement_drive.company_id != current_user.company.id:
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()



    interview = Interview(
        application_id=application.id,
        round_name=data["round_name"],
        interview_mode=data["interview_mode"],
        interview_date=datetime.strptime(data["interview_date"], "%Y-%m-%d").date(),
        interview_time=datetime.strptime(data["interview_time"], "%H:%M").time(),
        interview_location_or_meeting_link=data.get("interview_location_or_meeting_link"),
        # meeting_link=data.get("meeting_link"),
        remarks=data.get("remarks")
    )

    db.session.add(interview)

    application.status = "interview_scheduled"

    db.session.commit()

    return jsonify({
        "message": "Interview scheduled successfully"
    }), 201


@bp.route('/api/company/complete_interview/<int:application_id>', methods=['PUT'])
@auth_required('token')
@roles_required('company')
def complete_interview(application_id):

    application = Application.query.get(application_id)

    if application is None:
        return jsonify({"message": "Application not found"}), 404

    if application.placement_drive.company_id != current_user.company.id:
        return jsonify({"message": "Unauthorized"}), 403

    interviews = Interview.query.filter_by(application_id=application.id).all()

    if not interviews:
        return jsonify({"message": "No interviews have been scheduled"}), 400

    if application.status == "interview_completed":
        return jsonify({"message": "Interview is already marked as completed"}), 400

    for interview in interviews:
        interview.status = "completed"

    application.status = "interview_completed"

    db.session.commit()

    return jsonify({
        "message": "All interviews marked as completed successfully"
    }), 200


@bp.route('/api/company/select_candidate/<int:application_id>', methods=['PUT'])
@auth_required('token')
@roles_required('company')
def select_candidate(application_id):

    application = Application.query.get(application_id)

    if application is None:
        return jsonify({"message": "Application not found"}), 404

    if application.placement_drive.company_id != current_user.company.id:
        return jsonify({"message": "Unauthorized"}), 403

    # if application.status != "interview_completed":
    #     return jsonify({
    #         "message": "Interview must be completed before selecting the candidate"
    #     }), 400

    if application.status == "selected":
        return jsonify({"message": "Candidate is already selected"}), 400

    application.status = "selected"

    db.session.commit()

    return jsonify({
        "message": "Candidate selected successfully"
    }), 200
        
@bp.route('/api/company/reject_candidate/<int:application_id>', methods=['PUT'])
@auth_required('token')
@roles_required('company')
def reject_candidate(application_id):

    application = Application.query.get(application_id)

    if application is None:
        return jsonify({"message": "Application not found"}), 404

    if application.placement_drive.company_id != current_user.company.id:
        return jsonify({"message": "Unauthorized"}), 403

    # if application.status != "interview_completed":
    #     return jsonify({
    #         "message": "Interview must be completed before selecting the candidate"
    #     }), 400

    if application.status == "rejected":
        return jsonify({"message": "Candidate is already rejected"}), 400

    application.status = "rejected"

    db.session.commit()

    return jsonify({
        "message": "Candidate rejected successfully"
    }), 200

@bp.route('/api/company/interviews')
@auth_required('token')
@roles_required('company')
def company_interviews():

    interviews = Interview.query.all()
    interviews_list = []

    for interview in interviews:
        if interview.application.placement_drive.company_id == current_user.company.id:
            interviews_list.append(
                {
                    "id": interview.id,
                    "student_name": interview.application.student.name,
                    "status": interview.status,
                    "application_id": interview.application_id,
                    "round_name": interview.round_name,
                    "interview_date": interview.interview_date.strftime("%Y-%m-%d") if interview.interview_date else None,
                    "interview_time": interview.interview_time.strftime("%H:%M") if interview.interview_time else None,
                    "interview_mode": interview.interview_mode,
                    "interview_location_or_meeting_link": interview.interview_location_or_meeting_link,
                    "remarks": interview.remarks,
                }
            )

    return jsonify(interviews_list)

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
    batch_year = body["batch_year"]
    current_cgpa =float(body["current_cgpa"]) 
    phone_no = body["phone_no"]
    resume_link = body["resume_link"]

    

    if not email or not password or not name or not course  or not batch_year or not current_cgpa or not phone_no or not resume_link :
        return jsonify({"message": "All fields are required"}), 400

    if current_app.security.datastore.find_user(email=email):
        return jsonify({"message" : "User already exists"}), 400
    
    new_user= current_app.security.datastore.create_user(
        email=email,
        password=hash_password(password),
        roles = ['student']
    )
    db.session.commit()

    new_student= Student(name=name,user_id=new_user.id, course=course,  batch_year=batch_year, current_cgpa=current_cgpa, phone_no=phone_no, resume_link=resume_link )
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


@bp.route('/api/student/overview')
@auth_required('token')
@roles_required('student')
def student_overview():

    ongoing_placement_drive_count = PlacementDrive.query.filter(                                    # filter: when want to use operators like >,< , we need to write class name in bracket also, filter_by: simple, cants use operators , dont write class name in brackets
        PlacementDrive.deadline >= date.today()
    ).count()

    registered_company_count = len(registered_company_list(Company.query.all()))

    applied_drives_count= Application.query.filter(Application.student_id==current_user.student.id).count()

    return jsonify({
        "ongoing_placement_drive_count": ongoing_placement_drive_count,
        "registered_company_count": registered_company_count,
        "applied_drives_count": applied_drives_count,
    })

@bp.route('/api/student/profile')
@auth_required('token')
@roles_required('student')
def student_profile():
    user=User.query.get(current_user.id)
    student=user.student

    return jsonify({
        "id": student.id,
        "student_name": student.name,
        "student_course": student.course,
        "student_batch_year": student.batch_year,
        "student_current_cgpa": student.current_cgpa,
        "student_phone_no": student.phone_no,
        "student_resume_link": student.resume_link,
        # "applications": student.applications,
    })
        

@bp.route('/api/student/registered_companies')
@auth_required('token')
@roles_required('student')
def student_registered_companies():
    registered_company= registered_company_list( Company.query.all())
    # companies = Company.query.all()
    company_list = []
    for company in registered_company:
    #     if company.user.active == True:
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


@bp.route('/api/student/ongoing_placement_drives')
@auth_required('token')
@roles_required('student')
def student_ongoing_placement_drives():

    ongoing_placement_drives = PlacementDrive.query.filter(
        PlacementDrive.deadline > date.today()
    ).all()

    drive_list = []

    for drive in ongoing_placement_drives:

        drive_list.append({
            "id": drive.id,

            "job_title": drive.job_title,
            "job_description": drive.job_description,

            "company_id": drive.company.id,
            "company_name": drive.company.name,

            "deadline": drive.deadline.strftime("%d-%m-%Y")
                if drive.deadline else None,

            "status": drive.status,
            "salary": drive.salary,

            "eligible_branches": drive.eligible_branches,
            "eligible_passing_years": drive.eligible_passing_years,
            "eligible_minimum_cgpa": drive.eligible_minimum_cgpa,

            "application_count": len(drive.applications),

            "jd_link": drive.jd_link
        })

    return jsonify(drive_list)


# @bp.route('/api/student/applied_drives')
# @auth_required('token')
# @roles_required('student')
# def student_applied_drives():
#     student = Student.query.filter_by(user_id=current_user.id).first()
#     applications = Application.query.filter_by(student_id=student.id).all()

#     applications_list = []
#     for application in applications:
#         applications_list.append({
#             "id": application.id,
#             "drive_id": application.drive_id,
#             "job_title": application.placement_drive.job_title,
#             "company": application.placement_drive.company.name
#         })
#     return jsonify(applications_list)


@bp.route('/api/student/view_placement_drive/<int:drive_id>', methods = ['GET'])                    #dashboard
@auth_required('token')
@roles_required('student')
def student_ongoing_placement_drive(drive_id):
    drive=PlacementDrive.query.get(drive_id)
    drive_data={
        "job_title": drive.job_title,
        "job_description": drive.job_description,
        "deadline": drive.deadline,
        "eligible_branches": drive.eligible_branches,
        "eligible_passing_years": drive.eligible_passing_years,
        "eligible_minimum_cgpa": drive.eligible_minimum_cgpa,
        "salary": drive.salary,
        "jd_link": drive.jd_link,
        "applications_count": len(drive.applications),

    }
    return jsonify(drive_data)
 

from datetime import date

@bp.route('/api/student/apply/<int:drive_id>', methods=['POST'])
@auth_required('token')
@roles_required('student')
def student_apply_drive(drive_id):

    # Check drive exists or not
    drive = PlacementDrive.query.get(drive_id)

    if drive is None:
        return jsonify({"message": "Placement drive not found."}),404

    # Check deadline
    if drive.deadline < date.today():
        return jsonify({"message": "Application deadline has passed."})

    # check duplicate applications
    existing_application = Application.query.filter_by(student_id=current_user.student.id,drive_id=drive_id).first()

    if existing_application:
        return jsonify({"message": "You have already applied for this drive."})

    # make application
    application = Application(student_id=current_user.student.id,drive_id=drive_id)

    db.session.add(application)
    db.session.commit()

    return jsonify({"message": "Applied successfully."})


@bp.route('/api/student/applied_drives', methods=['GET'])
@auth_required('token')
@roles_required('student')
def student_applied_drives():

    student = current_user.student

    applied_drives = []

    for application in student.applications:
        drive = application.placement_drive
        company = drive.company

        applied_drives.append({
            "application_id": application.id,
            "application_date": application.application_date,
            "application_status": application.status,

            "drive_id": drive.id,
            "job_title": drive.job_title,
            "job_description": drive.job_description,
            "deadline": drive.deadline,
            "salary": drive.salary,
            "jd_link": drive.jd_link,

            "company_name": company.name,
            "company_location": company.location,
            "company_industry_type": company.industry_type
        })

    return jsonify(applied_drives)


@bp.route('/api/student/interviews')
@auth_required('token')
@roles_required('student')
def student_interviews():

    interviews = Interview.query.join(Application).filter(
        Application.student_id == current_user.student.id
    ).all()

    interviews_list = []

    for interview in interviews:
        interviews_list.append({
            "id": interview.id,
            "company_name": interview.application.placement_drive.company.name,
            "job_title": interview.application.placement_drive.job_title,
            "status": interview.status,
            "application_id": interview.application_id,
            "round_name": interview.round_name,
            "interview_mode": interview.interview_mode,
            "interview_date": interview.interview_date.strftime("%Y-%m-%d") if interview.interview_date else None,
            "interview_time": interview.interview_time.strftime("%H:%M") if interview.interview_time else None,
            "interview_location_or_meeting_link": interview.interview_location_or_meeting_link,
            "remarks": interview.remarks,
            "application_status": interview.application.status
        })

    return jsonify(interviews_list), 200

@bp.route('/student', methods = ['GET'])                    #dashboard
@auth_required('token')
@roles_required('student')
def student_dasboard():
    return jsonify(
        {
            "message": f"Student Dashboard, This is {current_user.email} dashboard"
        }
    )
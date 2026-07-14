export default {
    template: `
    <div>
        <div class="row" style="background-color: #eff1f3ee; padding: 20px; border-radius: 5px;">
            <h2 style="font-family: sans-serif; font-size: 30px; font-weight: bold;">Company Profile</h2>
        </div>
       

        <form style="padding: 20px;">
            <div class="mb-3">
                <label for="ID" class="form-label">ID</label>
                <input
                    class="form-control"
                    id="ID"
                    type="text"
                    :placeholder="student_profile.id"
                    disabled
                >
            </div>

            <div class="mb-3">
                <label for="student_name" class="form-label">Student Name</label>
                <input
                    class="form-control"
                    id="student_name"
                    type="text"
                    :placeholder="student_profile.student_name"
                    disabled
                >
            </div>

            <div class="mb-3">
                <label for="student_course" class="form-label">Student Course</label>
                <input
                    class="form-control"
                    id="student_course"
                    type="text"
                    :placeholder="student_profile.student_course"
                    disabled
                >
            </div>

            <div class="mb-3">
                <label for="student_batch_year" class="form-label">Student Batch Year</label>
                <input
                    class="form-control"
                    id="student_batch_year"
                    type="text"
                    :placeholder="student_profile.student_batch_year"
                    disabled
                >
            </div>

            <div class="mb-3">
                <label for="student_current_cgpa" class="form-label">Student Current Cgpa</label>
                <input
                    class="form-control"
                    id="student_current_cgpa"
                    type="text"
                    :placeholder="student_profile.student_current_cgpa"
                    disabled
                >
            </div>

            <div class="mb-3">
                <label for="student_phone_no" class="form-label">Student Contact</label>
                <input
                    class="form-control"
                    id="student_phone_no"
                    type="text"
                    :placeholder="student_profile.student_phone_no"
                    disabled
                >
            </div>

            <div class="mb-3">
                <label for="student_resume_link" class="form-label">Student Resume Link</label>
                <input
                    class="form-control"
                    id="student_resume_link"
                    type="text"
                    :placeholder="student_profile.student_resume_link"
                    disabled
                >
            </div>

            
            

            

        </form>
    </div>`,
    data: function(){
        return {
            student_profile: {}

            
        }
    },
    mounted(){
        this.load_student_profile()
    },
    methods:{
        load_student_profile(){
            fetch('/api/student/profile', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => this.student_profile = data)
        }
    }

}
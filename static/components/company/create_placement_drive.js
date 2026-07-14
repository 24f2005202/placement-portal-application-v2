export default {
    template: `
    <div style="max-width: 600px; margin: auto; padding: 20px;">

        <div class="mb-3">
            <label for="job_title" class="form-label">Job Title</label>
            <input type="text" class="form-control" id="job_title" v-model="formData.job_title">
        </div>

        <div class="mb-3">
            <label for="job_description" class="form-label">Description</label>
            <textarea class="form-control" id="job_description" rows="3" v-model="formData.job_description"></textarea>
        </div>

        <div class="mb-3">
            <label for="deadline" class="form-label">Deadline</label>
            <input type="date" class="form-control" id="deadline" v-model="formData.deadline">
        </div>

        <div class="mb-3">
            <label for="eligible_branches" class="form-label">Eligible Branches</label>
            <input type="text" class="form-control" id="eligible_branches" v-model="formData.eligible_branches" aria-describedby="eligible_branches_eg" >
            <div id="eligible_branches_eg" class="form-text">comma separated, Eg. BTECH-CSE,BS-DSA,MTECH-ECE</div>
        </div>

        <div class="mb-3">
            <label for="eligible_passing_years" class="form-label">Eligible Passing Years</label>
            <input type="text" class="form-control" id="eligible_passing_years" v-model="formData.eligible_passing_years" aria-describedby="eligible_passing_years_eg" >
            <div id="eligible_passing_years_eg" class="form-text">comma separated, Eg. 2020,2021,2022</div>
        </div>

        <div class="mb-3">
            <label for="eligible_minimum_cgpa" class="form-label">Eligible Minimum CGPA</label>
            <input type="text" class="form-control" id="eligible_minimum_cgpa" v-model="formData.eligible_minimum_cgpa">
        </div>

        <div class="mb-3">
            <label for="salary" class="form-label">Salary</label>
            <input type="text" class="form-control" id="salary" v-model="formData.salary" aria-describedby="salary_help">
            <div id="salary_help" class="form-text">In INR</div>
        </div>

        <div class="mb-3">
            <label for="jd_link" class="form-label">JD Link</label>
            <input type="text" class="form-control" id="jd_link" v-model="formData.jd_link" aria-describedby="jd_link_help" >
            <div id="jd_link_help" class="form-text">Drive/Web page link</div>
        </div>

        <button type="submit" class="btn btn-primary" @click="createDrive">Create Placement Drive</button>




       
    </div>
    `,
    data: function() {
        return {
            formData:{
                job_title: "",
                job_description: "",
                deadline: "",
                eligible_branches: "",
                eligible_passing_years: "",
                eligible_minimum_cgpa: "",
                salary: "",
                jd_link: "",
            }
        }
    },
    methods:{
        async createDrive() {
            try {
                const response = await fetch('/api/company/create_placement_drive', {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json',
                        "Authentication-Token": localStorage.getItem("auth_token")
                    },
                    body: JSON.stringify(this.formData)
                });

                const data = await response.json();

                if(data["message"] === "Placement drive created successfully") {
                    alert("Placement drive created successfully.");
                    this.$router.push('/company_dashboard/ongoing_placement_drives');
                } else {
                    alert(data["message"]);
                }

            } catch (error) {
                console.error("Failed to create placement drive:", error);
                alert("Something went wrong. Please try again.");
            }
        }
    }
}
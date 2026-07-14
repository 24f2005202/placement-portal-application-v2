export default {
    template: `
    <div>
        <div class="row" style="background-color: #eff1f3ee; padding: 20px; border-radius: 5px;">
            <h2 style="font-family: sans-serif; font-size: 30px; font-weight: bold;">
                Student Applications
            </h2>
        </div>

        <div class="row" style="padding: 20px;">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Application ID</th>
                        <th scope="col">Drive ID</th>
                        <th scope="col">Student</th>
                        <th scope="col">Company</th>
                        <th scope="col">Job Title</th>
                        <th scope="col">Status</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="application in applications" :key="application.id">
                        <td>{{ application.id }}</td>
                        <td>{{ application.drive_id }}</td>
                        <td>{{ application.student_name }}</td>
                        <td>{{ application.company_name }}</td>
                        <td>{{ application.job_title }}</td>
                        <td>{{ application.status }}</td>
                        <td>
                            <button
                                type="button"
                                class="btn btn-primary"
                                @click="viewDetails(application)">
                                View Details
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `,

    data() {
        return {
            applications: []
        }
    },

    mounted() {
        this.loadApplications()
    },

    methods: {

        async loadApplications() {
            const response = await fetch('/api/admin/student_applications', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })

            const data = await response.json()
            this.applications = data
        },

        viewDetails(application) {

            alert(
                `Application ID: ${application.id}

                Student Name: ${application.student_name}
                Course: ${application.student_course}
                Batch: ${application.student_batch}
                CGPA: ${application.student_cgpa}

                Company: ${application.company_name}
                Job Title: ${application.job_title}

                Application Date: ${application.application_date}

                Status: ${application.status}

                Resume Link:
                ${application.resume_link}`
            )

        }

    }
}
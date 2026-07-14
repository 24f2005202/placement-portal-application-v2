export default {
    template: `
    <div>

        <div class="row" style="background-color: #eff1f3ee; padding:20px; border-radius:5px;">
            <h2 style="font-family:sans-serif; font-size:30px; font-weight:bold;">
                Applied Placement Drives
            </h2>
        </div>

        <div class="row" style="padding: 20px;">
            <table class="table">

                <thead>
                    <tr>
                        <th scope="col">Application ID</th>
                        <th scope="col">Job Title</th>
                        <th scope="col">Company</th>
                        <th scope="col">Status</th>
                        <th scope="col">Applied On</th>
                        <th scope="col">Deadline</th>
                        <th scope="col">Salary</th>
                    </tr>
                </thead>

                <tbody>

                    <tr v-for="drive in appliedDrives" :key="drive.application_id">
                        <td scope="row">{{ drive.application_id }}</td>

                        <td>{{ drive.job_title }}</td>

                        <td>{{ drive.company_name }}</td>

                        <td>{{ drive.application_status }}</td>

                        <td>{{ drive.application_date }}</td>

                        <td>{{ drive.deadline }}</td>

                        <td> ₹ {{ drive.salary }}</td>

            

                    </tr>

                </tbody>

            </table>

        </div>

    </div>
    `,

    data() {
        return {
            appliedDrives: []
        }
    },

    mounted() {
        this.loadAppliedDrives()
    },

    methods: {

        async loadAppliedDrives() {

            try {

                const response = await fetch('/api/student/applied_drives', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("auth_token")
                    }
                })

                const data = await response.json()

                this.appliedDrives = data

            }
            catch (err) {
                console.log(err)
            }

        },

        viewDrive(drive) {
            console.log(drive)

            // Later you can route to a details page
            // this.$router.push('/student/applied-drive/' + drive.application_id)

            alert(
                "Job Title : " + drive.job_title +
                "\\nCompany : " + drive.company_name +
                "\\nStatus : " + drive.application_status
            )
        }

    }

}
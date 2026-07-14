export default {
    template: `
    <div>
        <div class="row" style="background-color: #eff1f3ee; padding: 20px; border-radius: 5px;">
            <h2 style="font-family: sans-serif; font-size: 30px; font-weight: bold;">
                Ongoing Placement Drives
            </h2>
        </div>

        <div class="row" style="padding: 20px;">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Job Title</th>
                        <th scope="col">Company</th>
                        <th scope="col">Deadline</th>
                        <th scope="col">JD Link</th>
                        <th scope="col">Applications</th>
                        
                        <th scope="col">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="drive in ongoingDrives" :key="drive.id">
                        <td>{{ drive.id }}</td>
                        <td>{{ drive.job_title }}</td>
                        <td>{{ drive.company_name }}</td>
                        <td>{{ drive.deadline }}</td>
                        <td><a :href="drive.jd_link" target="_blank"> View JD</a>
                        <td>{{ drive.application_count }}</td>
                        
                        <td>
                            <button
                                type="button"
                                class="btn btn-primary"
                                @click="viewDetails(drive)">
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
            ongoingDrives: [],
            selectedDrive: null
        }
    },

    mounted() {
        this.loadOngoingDrives()
    },

    methods: {
        async loadOngoingDrives() {
            const response = await fetch('/api/admin/ongoing_placement_drives', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })

            const data = await response.json()
            this.ongoingDrives = data
        },

        viewDetails(drive) {
    alert(
`Job Title: ${drive.job_title}

Company: ${drive.company_name}

Description: ${drive.job_description}

Deadline: ${drive.deadline}

Salary: ₹${drive.salary}

Minimum CGPA: ${drive.eligible_minimum_cgpa}

Eligible Branches: ${drive.eligible_branches.join(", ")}

Eligible Passing Years: ${drive.eligible_passing_years.join(", ")}

Applications: ${drive.application_count}

JD Link:
${drive.jd_link}`
    )
}
    }
}
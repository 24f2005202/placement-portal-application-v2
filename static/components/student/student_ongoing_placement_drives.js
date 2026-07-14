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
                        <th>ID</th>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Deadline</th>
                        <th>Status</th>
                        <th>Applications</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="drive in ongoingDrives" :key="drive.id">
                        <td>{{ drive.id }}</td>
                        <td>{{ drive.job_title }}</td>
                        <td>{{ drive.company_name }}</td>
                        <td>{{ drive.deadline }}</td>
                        <td>{{ drive.status }}</td>
                        <td>{{ drive.application_count }}</td>
                        <td>
                            <button
                                type="button"
                                class="btn btn-primary"
                                @click="viewDrive(drive.id)">
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
            ongoingDrives: []
        }
    },

    mounted() {
        this.loadOngoingDrives()
    },

    methods: {
        async loadOngoingDrives() {
            const response = await fetch('/api/student/ongoing_placement_drives', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            });

            const data = await response.json();
            this.ongoingDrives = data;
        },

        viewDrive(driveId) {
            this.$router.push(`/student_dashboard/view_placement_drive/${driveId}`);
        }
    }
}
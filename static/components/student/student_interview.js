export default {
    template: `
    <div>
        <div class="row" style="background-color: #eff1f3ee; padding: 20px; border-radius: 5px;">
            <div>
                <h2 style="font-family: sans-serif; font-size: 30px; font-weight: bold;">
                    Scheduled Interviews
                </h2>
            </div>
        </div>

        <div class="row" style="padding: 20px;">
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Application ID</th>
                        <th>Company</th>
                        <th>Job Title</th>
                        <th>Round</th>
                        <th>Mode</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Location / Meeting Link</th>
                        <th>Remarks</th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="interview in interviews"
                        :key="interview.id"
                        v-if="interview.status === 'scheduled'"
                    >
                        <td>{{ interview.id }}</td>
                        <td>{{ interview.application_id }}</td>
                        <td>{{ interview.company_name }}</td>
                        <td>{{ interview.job_title }}</td>
                        <td>{{ interview.round_name }}</td>
                        <td>{{ interview.interview_mode }}</td>
                        <td>{{ interview.interview_date }}</td>
                        <td>{{ interview.interview_time }}</td>
                        <td>{{ interview.interview_location_or_meeting_link }}</td>
                        <td>{{ interview.remarks }}</td>
                    </tr>
                </tbody>
            </table>
        </div>


        <div class="row" style="background-color: #eff1f3ee; padding: 20px; border-radius: 5px;">
            <div>
                <h2 style="font-family: sans-serif; font-size: 30px; font-weight: bold;">
                    Completed Interviews
                </h2>
            </div>
        </div>

        <div class="row" style="padding: 20px;">
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Application ID</th>
                        <th>Company</th>
                        <th>Job Title</th>
                        <th>Round</th>
                        <th>Mode</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Location / Meeting Link</th>
                        <th>Remarks</th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="interview in interviews"
                        :key="interview.id"
                        v-if="interview.status === 'completed'"
                    >
                        <td>{{ interview.id }}</td>
                        <td>{{ interview.application_id }}</td>
                        <td>{{ interview.company_name }}</td>
                        <td>{{ interview.job_title }}</td>
                        <td>{{ interview.round_name }}</td>
                        <td>{{ interview.interview_mode }}</td>
                        <td>{{ interview.interview_date }}</td>
                        <td>{{ interview.interview_time }}</td>
                        <td>{{ interview.interview_location_or_meeting_link }}</td>
                        <td>{{ interview.remarks }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `,

    data() {
        return {
            interviews: []
        }
    },

    mounted() {
        this.loadInterviews();
    },

    methods: {
        async loadInterviews() {
            const response = await fetch('/api/student/interviews', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            });

            const data = await response.json();
            this.interviews = data;
        }
    }
}
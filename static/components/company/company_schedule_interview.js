export default {
    template: `
    <div style="max-width: 600px; margin: auto; padding: 20px;">
        <div class="row" style="background-color: #eff1f3ee; padding: 20px; border-radius: 5px;">
            <h2 style="font-family: sans-serif; font-size: 30px; font-weight: bold;">Schedule Interview</h2>
        </div>
        <br>


        <div class="mb-3">
            <label for="round_name" class="form-label">Round Name</label>
            <input type="text" class="form-control" id="round_name" v-model="schedule_interview_data.round_name">
        </div>
        
        
        <div class="mb-3">
            <label for="interview_date" class="form-label">interview_date</label>
            <input type="date" class="form-control" id="interview_date" v-model="schedule_interview_data.interview_date">
        </div>
        

        <div class="mb-3">
            <label for="interview_time" class="form-label">interview_time</label>
            <input type="time" class="form-control" id="interview_time" v-model="schedule_interview_data.interview_time">
        </div>


        <div class="mb-3">
            <label for="interview_mode" class="form-label">interview_mode</label>
            <select class="form-select" v-model="schedule_interview_data.interview_mode">
            <option disabled value="">Interview Mode</option>
            <option value="In-person">In-person</option>
            <option value="Online">Online</option>
        </select>
        </div>
        

        <div class="mb-3">
            <label for="interview_location_or_meeting_link" class="form-label">interview_location_or_meeting_link</label>
            <input type="text" class="form-control" id="interview_location_or_meeting_link" v-model="schedule_interview_data.interview_location_or_meeting_link">
        </div>
        

        <div class="mb-3">
            <label for="remarks" class="form-label">remarks</label>
            <input type="text" class="form-control" id="remarks" v-model="schedule_interview_data.remarks">
        </div>


        <button type="submit" class="btn btn-primary" @click="schedule_interview">Schedule Interview</button>
                




       
    </div>
    `,
    data: function() {
        return {
            schedule_interview_data: {
                "application_id": "",
                "round_name": "",
                "interview_mode": "",
                "interview_date":"",
                "interview_time": "",
                "interview_location_or_meeting_link":"",
                "remarks": ""
            }
        }
    },
    methods:{
        async schedule_interview() {
            try {
                const response = await fetch(`/api/company/schedule_interview/${this.$route.params.id}`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json',
                        "Authentication-Token": localStorage.getItem("auth_token")
                    },
                    body: JSON.stringify(this.schedule_interview_data)
                });

                const data = await response.json();

                alert(data["message"]);
                this.$router.go(-1)

            } catch (error) {
                console.error("Failed to create placement drive:", error);
                alert("Something went wrong. Please try again.");
            }
        }
    }
}
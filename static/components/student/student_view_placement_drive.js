export default {
    template: `
    <div >
        <div class="row" style="background-color: #eff1f3ee; padding: 20px; border-radius: 5px;">

            <div class="row" style="background-color: #eff1f3ee; padding: 20px; border-radius: 5px;">
                <h2 style="font-family: sans-serif; font-size: 30px; font-weight: bold;">View Placement Drive</h2>
            </div>

            <p>Job Title: {{ placement_drive.job_title }}</p>
            <p>Job Description: {{ placement_drive.job_description }}</p>
            <p>Deadline: {{ placement_drive.deadline }}</p>
            <p>Eligible Branches: {{ placement_drive.eligible_branches.join(", ") }}</p>
            <p>Eligible Passing Years: {{ placement_drive.eligible_passing_years.join(", ") }}</p>
            <p>Eligible Minium CGPA: {{ placement_drive.eligible_minimum_cgpa }}</p>
            <p>salary: {{ placement_drive.salary}}</p>
            <p>JD Link: <a :href="placement_drive.jd_link" target="_blank"> View JD</a></p>
            
            <p>Applications recieved till now: {{ placement_drive.applications_count}}</p>
            <button type="button" class="btn btn-primary" @click="apply_drive">Apply</button>

        </div>

        
    </div>`,
    data: function(){
        return {
            placement_drive: {}

            
        }
    },
    mounted(){
        this.loadPlacementDrive()
    },
    methods:{
        async loadPlacementDrive(){
            const response = await fetch(`/api/student/view_placement_drive/${this.$route.params.id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            const data = await response.json()
            this.placement_drive = data
        },
        async apply_drive() {
            const response = await fetch(`/api/student/apply/${this.$route.params.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            });

            const data = await response.json();
            alert(data.message);
            this.$router.push('/student_dashboard/applied_drives');

        }
    }
}
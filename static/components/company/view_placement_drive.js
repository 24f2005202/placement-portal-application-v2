export default {
    template: `
    <div >
        <div class="row" style="background-color: #eff1f3ee; padding: 20px; border-radius: 5px;">
        <div class="row" style="background-color: #eff1f3ee; padding: 20px; border-radius: 5px;">
        <h2 style="font-family: sans-serif; font-size: 30px; font-weight: bold;">View Placement Drive</h2>
        </div>
        <p>{{ placement_drive.job_title }}</p>
        <p>{{ placement_drive.job_description }}</p>
        <p>Deadline: {{ placement_drive.deadline }}</p>
        <p>Eligible Branches: {{ placement_drive.eligible_branches.join(", ") }}</p>
        <p>Eligible Passing Years: {{ placement_drive.eligible_passing_years.join(", ") }}</p>
        </div>

        <table class="table">
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Name Title</th>
                <th scope="col">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="application in placement_drive.applications" :key="application.id">
                <td scope="row">{{ application.id }}</td>
                <td>{{ application.name }}</td>
                <td>
                <button type="button" class="btn btn-info" @click="viewApplication(application.id)">View</button>
                </td>
            </tr>
        </tbody>
        </table>
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
            const response = await fetch(`/api/company/drive/${this.$route.params.id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            const data = await response.json()
            this.placement_drive = data
        }
    }
}
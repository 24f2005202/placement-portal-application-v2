export default {
    template: `
    <div>
        <div class="row" style="background-color: #eff1f3ee; padding: 20px; border-radius: 5px;">
        <h2 style="font-family: sans-serif; font-size: 30px; font-weight: bold;">Closed Placement Drives</h2>
        </div>

        <div class="row" style="padding: 20px;">
        <table class="table">
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Job Title</th>
                <th scope="col">Description</th>
                <th scope="col">Status</th>
                <th scope="col">Deadline</th>
                <th scope="col">Eligible Branches</th>
                <th scope="col">Eligible Passing Years</th>
                <th scope="col">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="drive in closed_placement_drives" :key="drive.id">
                <td scope="row">{{ drive.id }}</td>
                <td>{{ drive.job_title }}</td>
                <td>{{ drive.job_description }}</td>
                <td>{{ drive.status }}</td>
                <td>{{ drive.deadline }}</td>
                <td>{{ drive.eligible_branches.join(", ") }}</td>
                <td>{{ drive.eligible_passing_years.join(", ") }}</td>
                <td>
                <button type="button" class="btn btn-info" @click="viewDrive(drive.id)">View</button>
                </td>
            </tr>
        </tbody>
        </table>
        </div>
    </div>
    
    
    
    `,
    data: function(){
        return {
            closed_placement_drives: []
        }
    },
    mounted(){
        this.load_Closed_placement_drives()
    },
    methods:{
        async load_Closed_placement_drives(){
            const response= await fetch('/api/company/closed_placement_drives', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })

            const data= await response.json()
            this.closed_placement_drives = data
        },
        viewDrive(driveId){
            this.$router.push(`/company_dashboard/view_placement_drive/${driveId}`)
        }
        }
    }

export default {
    template: `
    <div>
        <div class="row" style="background-color: #eff1f3ee; padding: 20px; border-radius: 5px;">


        <div class="row ">
            <div class="col-10 " >
                <h2 style="font-family: sans-serif; font-size: 30px; font-weight: bold;">
                    Ongoing Placement Drives
                </h2>
            </div>
            <div class="col-2 " >
                <button type="button" class="btn btn-info" @click="createDrive">Create Drive</button>
            </div>
        </div>

        
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
            <tr v-for="drive in Ongoing_placement_drives" :key="drive.id">
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
            Ongoing_placement_drives: []
        }
    },
    mounted(){
        this.load_Ongoing_placement_drives()
    },
    methods:{
        async load_Ongoing_placement_drives(){
            const response= await fetch('/api/company/ongoing_placement_drives', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })

            const data= await response.json()
            this.Ongoing_placement_drives = data
        },
        createDrive(){
            this.$router.push('/company_dashboard/create_placement_drive')
        },
        viewDrive(driveId){
            this.$router.push(`/company_dashboard/view_placement_drive/${driveId}`)
        }
    }
}
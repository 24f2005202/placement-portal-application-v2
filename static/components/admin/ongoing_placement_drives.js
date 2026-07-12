export default {
    template: `
    <div>
        <div class="row" style="background-color: #eff1f3ee; padding: 20px; border-radius: 5px;">
        <h2 style="font-family: sans-serif; font-size: 30px; font-weight: bold;">Ongoing Placement Drives</h2>
        </div>

        <div class="row" style="padding: 20px;">
        <table class="table">
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="drive in ongoingDrives" :key="drive.id">
                <td scope="row">{{ drive.id }}</td>
                <td>{{ drive.name }}</td>
                <td>
                <button type="button" class="btn btn-primary">View Details</button>
                </td>
            </tr>
        </tbody>
        </table>
        </div>
    </div>
    
    
    
    `,
    data: function(){
        return {
            ongoingDrives: []
        }
    },
    mounted(){
        this.loadOngoingDrives()
    },
    methods:{
        async loadOngoingDrives(){
            const response= await fetch('/api/admin/ongoing_placement_drives', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })

            const data= await response.json()
            this.ongoingDrives = data
        }
        }
    }

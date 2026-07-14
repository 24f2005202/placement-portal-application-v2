export default {
    template: `
    <div>
        
        <div class="row " style=" font-family: sans-serif; font-size: 16px; font-weight: bold;" >
        <div class="col-5 border" style="height: 200px; margin: auto;margin-top: 20px;border-radius: 10px; box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.1)">
            <router-link to="/admin_dashboard/registered_students" style="text-decoration: none; color: #051117;">
                    <div style="font-size: 60px; margin-top: 20px;display: flex;justify-content: center;">  
                    {{overview_data.student_count}}
                    </div>

                    <div style="display: flex;justify-content: center;">
                    Registered Students 
                    </div>
            </router-link>
        </div>         
            
        <div class="col-5 border" style="height: 200px; margin: auto;margin-top: 20px;border-radius: 10px;border-radius: 10px; box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.1)">
            <router-link to="/admin_dashboard/registered_companies" style="text-decoration: none; color: #051117;">
                <div style="font-size: 60px; margin-top: 20px;display: flex;justify-content: center;">  
                {{overview_data.company_count}}
                </div>

                <div style="display: flex;justify-content: center;">
                Registered Companies 
                </div>
            </router-link>
        </div>

        <div class="col-5 border" style="height: 200px; margin: auto;margin-top: 20px;border-radius: 10px;border-radius: 10px; box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.1)">
            <router-link to="/admin_dashboard/ongoing_placement_drives" style="text-decoration: none; color: #051117; ">
                <div style="font-size: 60px; margin-top: 20px;display: flex;justify-content: center;">  
                {{overview_data.placement_drive_count}}
                </div>
                <div style="display: flex;justify-content: center;">
                Ongoing Placement Drives
                </div>
            </router-link>
        </div>

        <div class="col-5 border" style="height: 200px; margin: auto;margin-top: 20px;border-radius: 10px;border-radius: 10px; box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.1)">
            <router-link to="/admin_dashboard/company_applications" style="text-decoration: none; color: #051117; ">
                <div style="font-size: 60px; margin-top: 20px;display: flex;justify-content: center;">  
                {{overview_data.company_applications_count}}
                </div>
                <div style="display: flex;justify-content: center;">
                Companies Applications
                </div>
            </router-link>
        </div>

            
        </div>
    </div>`,
    data: function(){
        return {
            overview_data: {}
        }
    },
    mounted(){
        this.load_overview_data()
    },
    methods:{
        async load_overview_data(){
            try {
                const response = await fetch('/api/admin/overview', {
                    // method: 'GET',
                    headers: {
                        // "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("auth_token")
                    }
                });

                if (!response.ok) {
                    alert("Something went wrong in fetching overview data.");
                    return;
                }

                const data = await response.json();
                this.overview_data = data;

            } catch (error) {
                console.error(error);
                alert("Something went wrong.");
            }
        }
        
    }

}


// loadUser(){
//             fetch('/api/user_data', {
//                 method: 'GET',
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authentication-Token": localStorage.getItem("auth_token")
//                 }
//             })
//             .then(response => response.json())
//             .then(data => this.userData = data)
//         }
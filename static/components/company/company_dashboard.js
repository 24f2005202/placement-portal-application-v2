export default {
    template: `
    <div>
        <h4 class="my-2 mx-3">Welcome {{userData.email}}!</h4>
        
        <div class="row border">
            <div class="col-2 border" style="height: 750px;">
                

                <div class="sidebar-menu" style="display: flex; flex-direction: column; gap: 10px; padding: 10px">
                    
                    <router-link to="/company_dashboard" style="text-decoration: none; color: #051117; font-family: sans-serif; font-size: 16px; font-weight: bold; padding: 10px; border-radius: 6px;">
                        Dashboard
                    </router-link>
                    
                    <router-link to="/company_dashboard/profile" style="text-decoration: none; color: #051117; font-family: sans-serif; font-size: 16px; font-weight: bold; padding: 10px; border-radius: 6px;">
                        Profile
                    </router-link>
                    
                    <router-link to="/company_dashboard/ongoing_placement_drives" style="text-decoration: none; color: #051117; font-family: sans-serif; font-size: 16px; font-weight: bold; padding: 10px; border-radius: 6px;">
                        Ongoing Placement Drives
                    </router-link>

                    <router-link to="/company_dashboard/closed_placement_drives" style="text-decoration: none; color: #051117; font-family: sans-serif; font-size: 16px; font-weight: bold; padding: 10px; border-radius: 6px;">
                        Closed Placement Drives
                    </router-link>
                    


                </div>



            </div>
            <div class="col-10 border" style="height: 750px;">
                <router-view></router-view>
            </div>
        </div>
    </div>`,
    data: function(){
        return {
            userData: {}

            
        }
    },
    mounted(){
        this.loadUser()
    },
    methods:{
        async loadUser() {
        const token = localStorage.getItem("auth_token");

        if (!token) {
            alert("Unauthorized. Please login first.");
            this.$router.push('/login');
            return;                              //retuen to exit from function, if not the code following code will execute 
        }

        try {
            const response = await fetch('/api/user_data', {
                headers: {
                    "Authentication-Token": token
                }
            });

            if (!response.ok) {
                alert("Unauthorized. Please login first.");
                this.$router.push('/login');
                return;
            }

            const data = await response.json();
            this.userData = data;

        } catch (error) {
            console.error(error);
            alert("Something went wrong.");
        }
    }
    }

}
// promise way to load user data
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
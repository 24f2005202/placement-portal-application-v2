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
        loadUser(){
            fetch('/api/user_data', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => this.userData = data)
        }
    }

}
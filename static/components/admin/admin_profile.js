export default {
    template: `
    <div>
        <div class="row" style="background-color: #eff1f3ee; padding: 20px; border-radius: 5px;">
            <h2 style="font-family: sans-serif; font-size: 30px; font-weight: bold;">Admin Profile</h2>
        </div>
       

        <form style="padding: 20px;">
            <div class="mb-3">
                <label for="ID" class="form-label">ID</label>
                <input
                    class="form-control"
                    id="ID"
                    type="text"
                    :placeholder="userData.id"
                    disabled
                >
            </div>

            <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input
                    class="form-control"
                    id="email"
                    type="text"
                    :placeholder="userData.email"
                    disabled
                >
            </div>
        </form>
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
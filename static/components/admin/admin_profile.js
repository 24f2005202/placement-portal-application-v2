export default {
    template: `
    <div>
        ID: {{userData.id}}
        Email: {{userData.email}}
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
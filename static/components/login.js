export default {
    template: `
    <div class="login">
        <div class="login_form">
            <div>
                <h2>Login</h2>
                <div>
                    <label for="email">Email:</label>
                    <input type="text" id="email" v-model="formData.email">
                </div>
                <div>
                    <label for="pass">Create a password:</label>
                    <input type="password" id="pass" v-model="formData.password" @keyup.enter="login_user">   <!-- @keyup.enter="login_user": trigger login_user when enter is pressed  -->
                </div>
                <div>
                    <button @click="login_user">Login</button>
                </div>
                <p> 
                    Don't have an account? <br>
                    <router-link to="/student_register"> Register as Student </router-link"> or
                    <router-link to="/company_register"> Register as Company </router-link">
                </p>
            </div>
        </div>
    </div>
    `,
    data: function() {
        return {
            formData:{
                email: "",
                password: "",
            }
        }
    },
    methods:{
        async login_user() {
            try {
                const response = await fetch('/api/login', {
                                        method: 'POST',
                                        headers: {
                                            "Content-Type": 'application/json'
                                        },
                                        body: JSON.stringify(this.formData)
                });

                const data = await response.json();

                if(Object.keys(data).includes("auth_token")){

                    localStorage.setItem("auth_token", data["auth_token"])
                    localStorage.setItem("id", data["id"])
                    localStorage.setItem("role", data["role"])
                    localStorage.setItem("login_status", true)
                    
                    if(data["role"]==="admin"){
                        this.$router.push('/admin_dashboard');

                    } else if(data["role"]==="company"){
                        this.$router.push('/company_dashboard');
                        
                    } else{
                        this.$router.push('/student_dashboard');
                    }
                } else{
                    alert(data["message"])
                }

            } catch (error) {
                console.error("Login failed:", error);
            alert("Something went wrong. Please try again.");
            }
        }
    }
}
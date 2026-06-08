export default {
    template: `
    <div class="login">
        <div class="login_form">
            <div>
                <h2>Register as a Student</h2>
                <div>
                    <label for="email">Email:</label>
                    <input type="text" id="email" v-model="formData.email">
                </div>
                <div>
                    <label for="pass">Create a password:</label>
                    <input type="password" id="pass" v-model="formData.password">
                </div>
                <div>
                    <button @click="addUser">Register</button>
                </div>
                <p> 
                    Already have an account? 
                    <router-link to="/login"> Login </router-link">
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
        async addUser() {
            try {
                const response = await fetch('/api/register_student', {
                                        method: 'POST',
                                        headers: {
                                            "Content-Type": 'application/json'
                                        },
                                        body: JSON.stringify(this.formData)
                });

                const data = await response.json();

                alert(data.message);
                this.$router.push('/login');

            } catch (error) {
            console.error("Registration failed:", error);
            alert("Something went wrong. Please try again.");
            }
        }
    }
}
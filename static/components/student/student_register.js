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
                    <label for="name">Name:</label>
                    <input type="text" id="name" v-model="formData.name">
                </div>
                <div>
                    <label for="course">Course :</label>
                    <input type="text" id="course" v-model="formData.course">
                </div>
                <div>
                    <label for="batch_year">Batch Year:</label>
                    <input type="text" id="batch_year" v-model="formData.batch_year">
                </div>
                <div>
                    <label for="current_cgpa">Current CGPA:</label>
                    <input type="text" id="current_cgpa" v-model="formData.current_cgpa">
                </div>
                <div>
                    <label for="phone_no">Phone Number:</label>
                    <input type="text" id="phone_no" v-model="formData.phone_no">
                </div>
                <div>
                    <label for="resume_link">Resume Link:</label>
                    <input type="text" id="resume_link" v-model="formData.resume_link">
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

                name: "",
                course: "",
                batch_year: "",
                current_cgpa: "",
                phone_no: "",
                resume_link: ""
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
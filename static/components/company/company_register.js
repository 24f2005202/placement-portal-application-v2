export default {
    template: `
    <div class="login">
        <div class="login_form">
            <div>
                <h2>Register as a Company</h2>
                <div>
                    <label for="email">Email:</label>
                    <input type="text" id="email" v-model="formData.email">
                </div>
                <div>
                    <label for="pass">Ceeate a password:</label>
                    <input type="password" id="pass" v-model="formData.password">
                </div>

                <div>
                    <label for="name">Company's Name:</label>
                    <input type="text" id="name" v-model="formData.name">
                </div>
                <div>
                    <label for="website_url"> Company's Website URL:</label>
                    <input type="text" id="website_url" v-model="formData.website_url">
                </div>
                <div>
                    <label for="industry_type">Industry Type:</label>
                    <input type="text" id="industry_type" v-model="formData.industry_type">
                </div>
                <div>
                    <label for="location">Location:</label>
                    <input type="text" id="location" v-model="formData.location">
                </div>
                <div>
                    <label for="hr_contact_number">Contact Number of HR:</label>
                    <input type="text" id="hr_contact_number" v-model="formData.hr_contact_number">
                </div>
                <div>
                    <label for="hr_email">Email of HR:</label>
                    <input type="text" id="hr_email" v-model="formData.hr_email">
                </div>
                <div>
                    <label for="company_description">Company Description:</label>
                    <input type="text" id="company_description" v-model="formData.company_description">
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
                website_url: "",
                industry_type: "",
                location: "",
                hr_contact_number: "",
                hr_email: "",
                company_description: "",
            } 
        }
    },
    methods:{
        async addUser() {
            try {
                const response = await fetch('/api/register_company', {
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
export default {
    template: `
    <div>
        <div class="row" style="background-color: #eff1f3ee; padding: 20px; border-radius: 5px;">
            <h2 style="font-family: sans-serif; font-size: 30px; font-weight: bold;">Company Profile</h2>
        </div>
       

        <form style="padding: 20px;">
            <div class="mb-3">
                <label for="ID" class="form-label">ID</label>
                <input
                    class="form-control"
                    id="ID"
                    type="text"
                    :placeholder="company_profile.id"
                    disabled
                >
            </div>

            <div class="mb-3">
                <label for="company_name" class="form-label">Company Name</label>
                <input
                    class="form-control"
                    id="company_name"
                    type="text"
                    :placeholder="company_profile.company_name"
                    disabled
                >
            </div>
            
            <div class="mb-3">
                <label for="company_location" class="form-label">Company Location</label>
                <input
                    class="form-control"
                    id="company_location"
                    type="text"
                    :placeholder="company_profile.company_location"
                    disabled
                >
            </div>
            <div class="mb-3">
                <label for="company_hr_contact_number" class="form-label">HR Contact_number</label>
                <input
                    class="form-control"
                    id="company_hr_contact_number"
                    type="text"
                    :placeholder="company_profile.company_hr_contact_number"
                    disabled
                >
            </div>
            <div class="mb-3">
                <label for="company_hr_email" class="form-label">HR Email</label>
                <input
                    class="form-control"
                    id="company_hr_email"
                    type="text"
                    :placeholder="company_profile.company_hr_email"
                    disabled
                >
            </div>
            <div class="mb-3">
                <label for="company_description" class="form-label">Company Description</label>
                <textarea
                    class="form-control"
                    id="company_description"
                    type="text"
                    :placeholder="company_profile.company_description"
                    disabled
                ></textarea>
            </div>
            

            

        </form>
    </div>`,
    data: function(){
        return {
            company_profile: {}

            
        }
    },
    mounted(){
        this.load_company_profile()
    },
    methods:{
        load_company_profile(){
            fetch('/api/company/profile', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => this.company_profile = data)
        }
    }

}
export default {
    template: `
    <div>
        <div class="row" style="background-color: #eff1f3ee; padding: 20px; border-radius: 5px;">
        <h2 style="font-family: sans-serif; font-size: 30px; font-weight: bold;">Company Applications</h2>
        </div>

        <div class="row" style="padding: 20px;">
        <table class="table">
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Website URL</th>
                <th scope="col">Industry Type</th>
                <th scope="col">Location</th>
                <th scope="col">HR Contact Number</th>
                <th scope="col">HR Email</th>
                <th scope="col">Company Description</th>
                <th scope="col">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="company in CompaniesApplications" :key="company.id">
                <td scope="row">{{ company.id }}</td>
                <td>{{ company.name }}</td>
                <td>{{ company.website_url }}</td>
                <td>{{ company.industry_type }}</td>
                <td>{{ company.location }}</td>
                <td>{{ company.hr_contact_number }}</td>
                <td>{{ company.hr_email }}</td>
                <td>{{ company.company_description }}</td>
                <td>
                <button type="button" class="btn btn-success" @click="activate_company(company.id)">Approve</button>
                </td>
            </tr>
        </tbody>
        </table>
        </div>
    </div>
    
    
    
    `,
    data: function(){
        return {
            CompaniesApplications: []
        }
    },
    mounted(){
        this.loadRegisteredCompanies()
    },
    methods:{
        async loadRegisteredCompanies(){
            const response= await fetch('/api/admin/company_applications', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })

            const data= await response.json()
            this.CompaniesApplications = data
        },
        async activate_company(company_id) {
            try {
                const response = await fetch(`/api/admin/activate_company/${company_id}`, {
                    method: "PUT",
                    headers: {
                        "Authentication-Token": localStorage.getItem("auth_token")
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    alert(data.message);
                    this.loadRegisteredCompanies();
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error(error);
                alert("Something went wrong.");
            }
        }
        }
    }

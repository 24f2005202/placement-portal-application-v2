export default {
    template: `
    <div>
        <div class="row" style="background-color: #eff1f3ee; padding: 20px; border-radius: 5px;">
        <h2 style="font-family: sans-serif; font-size: 30px; font-weight: bold;">Registered Companies</h2>
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
            </tr>
        </thead>
        <tbody>
            <tr v-for="company in registeredCompanies" :key="company.id">
                <td scope="row">{{ company.id }}</td>
                <td>{{ company.name }}</td>
                <td>{{ company.website_url }}</td>
                <td>{{ company.industry_type }}</td>
                <td>{{ company.location }}</td>
                <td>{{ company.hr_contact_number }}</td>
                <td>{{ company.hr_email }}</td>
                <td>{{ company.company_description }}</td>
            </tr>
        </tbody>
        </table>
        </div>
    </div>
    
    
    
    `,
    data: function(){
        return {
            registeredCompanies: []
        }
    },
    mounted(){
        this.loadRegisteredCompanies()
    },
    methods:{
        async loadRegisteredCompanies(){
            const response= await fetch('/api/student/registered_companies', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })

            const data= await response.json()
            this.registeredCompanies = data
        }
        }
    }

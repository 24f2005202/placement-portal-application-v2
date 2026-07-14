export default {
    template: `
    <div>
        <div class="row" style="background-color: #eff1f3ee; padding: 20px; border-radius: 5px;">
            <h2 style="font-family: sans-serif; font-size: 30px; font-weight: bold;">
                Deactivated Companies
            </h2>
        </div>

        <div class="row" style="padding: 20px;">
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Company Name</th>
                        <th>Industry</th>
                        <th>Location</th>
                        <th>HR Email</th>
                        <th>HR Contact</th>
                        <th>Website</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="company in deactivated_companies" :key="company.id">
                        <td>{{ company.id }}</td>
                        <td>{{ company.name }}</td>
                        <td>{{ company.industry_type }}</td>
                        <td>{{ company.location }}</td>
                        <td>{{ company.hr_email }}</td>
                        <td>{{ company.hr_contact_number }}</td>
                        <td>
                            <a :href="company.website_url" target="_blank">
                                Visit
                            </a>
                        </td>
                        <td>
                            <button
                                class="btn btn-success btn-sm"
                                @click="activate_company(company.id)"
                            >
                                Activate
                            </button>
                        </td>
                    </tr>

                    <tr v-if="deactivated_companies.length === 0">
                        <td colspan="8" class="text-center">
                            No deactivated companies found.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `,

    data() {
        return {
            deactivated_companies: []
        };
    },

    mounted() {
        this.loadDeactivatedCompanies();
    },

    methods: {
        async loadDeactivatedCompanies() {
            try {
                const response = await fetch('/api/admin/deactivated_companies', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("auth_token")
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    this.deactivated_companies = data;
                } else {
                    alert(data.message || "Failed to load deactivated companies.");
                }
            } catch (error) {
                console.error(error);
                alert("Something went wrong.");
            }
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
                    this.loadDeactivatedCompanies();
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
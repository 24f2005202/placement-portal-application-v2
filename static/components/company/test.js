// testing model for scheduling interview: view_placement_drive.js
export default {
    template: `
    <div >
        <div class="row" style="background-color: #eff1f3ee; padding: 20px; border-radius: 5px;">

            <div class="row" style="background-color: #eff1f3ee; padding: 20px; border-radius: 5px;">
                <h2 style="font-family: sans-serif; font-size: 30px; font-weight: bold;">View Placement Drive</h2>
            </div>

            <p>{{ placement_drive.job_title }}</p>
            <p>{{ placement_drive.job_description }}</p>
            <p>Deadline: {{ placement_drive.deadline }}</p>
            <p>Eligible Branches: {{ placement_drive.eligible_branches.join(",") }}</p>
            <p>Eligible Passing Years: {{ placement_drive.eligible_passing_years.join(",") }}</p>
        </div>

        <div class="row" style="background-color: #0080ff2c; padding: 20px; border-radius: 5px;">
            <h2 style="font-family: sans-serif; font-size: 20px; font-weight: bold;">Applications</h2>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">course</th>
                    <th scope="col">batch_year</th>
                    <th scope="col">current_cgpa</th>
                    <th scope="col">resume_link</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="application in placement_drive.applications" :key="application.application_id" v-if="application.status === 'applied'">
                    <td scope="row">{{ application.application_id }}</td>
                    <td>{{ application.name }}</td>
                    <td>{{ application.course }}</td>
                    <td>{{ application.batch_year }}</td>
                    <td>{{ application.current_cgpa }}</td>
                    <td>{{ application.resume_link }}</td>
                    <td>
                    <button type="button" class="btn btn-success" @click="shortlist(application.application_id)">Shortlist</button>
                    <button type="button" class="btn btn-danger" @click="reject(application.application_id)">Reject</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <hr> <br>

        <div class="row" style="background-color: #0080ff2c; padding: 20px; border-radius: 5px;">
                <h2 style="font-family: sans-serif; font-size: 20px; font-weight: bold;">Shortlisted</h2>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">course</th>
                    <th scope="col">batch_year</th>
                    <th scope="col">current_cgpa</th>
                    <th scope="col">resume_link</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="application in placement_drive.applications" :key="application.application_id" v-if="application.status === 'shortlisted'">
                    <td scope="row">{{ application.application_id }}</td>
                    <td>{{ application.name }}</td>
                    <td>{{ application.course }}</td>
                    <td>{{ application.batch_year }}</td>
                    <td>{{ application.current_cgpa }}</td>
                    <td>{{ application.resume_link }}</td>
                    <td>
                    <button type="button" class="btn btn-info" @click="schedule_interview(application.application_id)">Schedule Interview</button>
                    <!-- Button trigger modal -->
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#schedule_inter" @click="set_application_id(application.application_id)">
                    Launch demo modal
                    </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <hr> <br>
        <hr> <br>
        <hr> <br>
        <hr> <br>
        <hr> <br>
        <hr> <br>
        <hr> <br>

        

        <!-- Interview  Modal -->
        <div class="modal fade" id="schedule_inter" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Schedule Interview</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="round_name" class="form-label">Round Name</label>
                    <input type="text" class="form-control" id="round_name" v-model="schedule_interview_data.round_name">
                </div>
                
                <div class="mb-3">
                    <label for="interview_mode" class="form-label">interview_mode</label>
                    <input type="text" class="form-control" id="interview_mode" v-model="schedule_interview_data.interview_mode">
                </div>
                
                <div class="mb-3">
                    <label for="interview_date" class="form-label">interview_date</label>
                    <input type="date" class="form-control" id="interview_date" v-model="schedule_interview_data.interview_date">
                </div>
                
                <div class="mb-3">
                    <label for="interview_time" class="form-label">interview_time</label>
                    <input type="time" class="form-control" id="interview_time" v-model="schedule_interview_data.interview_time">
                </div>
                
                <div class="mb-3">
                    <label for="interview_location_or_meeting_link" class="form-label">interview_location_or_meeting_link</label>
                    <input type="text" class="form-control" id="interview_location_or_meeting_link" v-model="schedule_interview_data.interview_location_or_meeting_link">
                </div>
                
                <div class="mb-3">
                    <label for="remarks" class="form-label">remarks</label>
                    <input type="text" class="form-control" id="remarks" v-model="schedule_interview_data.remarks">
                </div>
                
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Schedule Interview</button>
            </div>
            </div>
        </div>
        </div>
                


        <hr> <br>
        <hr> <br>
        <hr> <br>
        <hr> <br>
        <hr> <br>
        <hr> <br>
        <hr> <br>
        <hr> <br>






        <div class="row" style="background-color: #0080ff2c; padding: 20px; border-radius: 5px;">
            <h2 style="font-family: sans-serif; font-size: 20px; font-weight: bold;">Interview Scheduled</h2>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">course</th>
                    <th scope="col">batch_year</th>
                    <th scope="col">current_cgpa</th>
                    <th scope="col">resume_link</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="application in placement_drive.applications" :key="application.application_id" v-if="application.status === 'interview_scheduled'">
                    <td scope="row">{{ application.application_id }}</td>
                    <td>{{ application.name }}</td>
                    <td>{{ application.course }}</td>
                    <td>{{ application.batch_year }}</td>
                    <td>{{ application.current_cgpa }}</td>
                    <td>{{ application.resume_link }}</td>
                    <td>
                    <button type="button" class="btn btn-info" @click="schedule_interview<(application.application_id)">Schedule another Interview</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <hr> <br>

        <div class="row" style="background-color: #0080ff2c; padding: 20px; border-radius: 5px;">
            <h2 style="font-family: sans-serif; font-size: 20px; font-weight: bold;">Interview Completed</h2>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">course</th>
                    <th scope="col">batch_year</th>
                    <th scope="col">current_cgpa</th>
                    <th scope="col">resume_link</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="application in placement_drive.applications" :key="application.application_id" v-if="application.status === 'interview_completed'">
                    <td scope="row">{{ application.application_id }}</td>
                    <td>{{ application.name }}</td>
                    <td>{{ application.course }}</td>
                    <td>{{ application.batch_year }}</td>
                    <td>{{ application.current_cgpa }}</td>
                    <td>{{ application.resume_link }}</td>
                    <td>
                    <button type="button" class="btn btn-success" @click="select<(application.application_id)">Select</button>
                    <button type="button" class="btn btn-danger" @click="reject<(application.application_id)">Reject</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <hr> <br>


        <div class="row" style="background-color: #0080ff2c; padding: 20px; border-radius: 5px;">
            <h2 style="font-family: sans-serif; font-size: 20px; font-weight: bold;">Selected</h2>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">course</th>
                    <th scope="col">batch_year</th>
                    <th scope="col">current_cgpa</th>
                    <th scope="col">resume_link</th>
                    
                </tr>
            </thead>
            <tbody>
                <tr v-for="application in placement_drive.applications" :key="application.application_id" v-if="application.status === 'selected'">
                    <td scope="row">{{ application.application_id }}</td>
                    <td>{{ application.name }}</td>
                    <td>{{ application.course }}</td>
                    <td>{{ application.batch_year }}</td>
                    <td>{{ application.current_cgpa }}</td>
                    <td>{{ application.resume_link }}</td>
            
                </tr>
            </tbody>
        </table>
        <hr> <br>


        <div class="row" style="background-color: #0080ff2c; padding: 20px; border-radius: 5px;">
            <h2 style="font-family: sans-serif; font-size: 20px; font-weight: bold;">Rejected</h2>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">course</th>
                    <th scope="col">batch_year</th>
                    <th scope="col">current_cgpa</th>
                    <th scope="col">resume_link</th>
                    
                </tr>
            </thead>
            <tbody>
                <tr v-for="application in placement_drive.applications" :key="application.id" v-if="application.status === 'rejected'">
                    <td scope="row">{{ application.application_id }}</td>
                    <td>{{ application.name }}</td>
                    <td>{{ application.course }}</td>
                    <td>{{ application.batch_year }}</td>
                    <td>{{ application.current_cgpa }}</td>
                    <td>{{ application.resume_link }}</td>
                    
                </tr>
            </tbody>
        </table>


        
    </div>`,
    data: function(){
        return {
            placement_drive: {
                eligible_branches: [],
                eligible_passing_years: [],
                applications: []
        },
        schedule_interview_data: {
            "application_id": "",
            "round_name": "",
            "interview_mode": "",
            "interview_date":"",
            "interview_time": "",
            "interview_location_or_meeting_link":"",
            "remarks": ""
        }

            
        }
    },
    mounted(){
        this.loadPlacementDrive()
    },
    methods:{
        async loadPlacementDrive(){
            const response = await fetch(`/api/company/drive/${this.$route.params.id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            const data = await response.json()
            this.placement_drive = data
        },
        async shortlist(application_id) {
            try {
                console.log(application_id)
                const response = await fetch(`/api/company/shortlist/${application_id}`, {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("auth_token")
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    alert(data.message);
                    this.loadPlacementDrive();
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error(error);
                alert("Something went wrong.");
            }
        },
        schedule_interview(application_id){
            this.$router.push(`/company_dashboard/schedule_interview/${application_id}`)
        }
    }
}
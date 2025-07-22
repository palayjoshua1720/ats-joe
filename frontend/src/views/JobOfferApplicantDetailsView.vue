<template>
	<div class="bg-gray-100 p-0 m-0">
		<!-- Application Title Box outside the card -->
		<div class="flex items-center max-w-8xl mx-auto">
			<h2 class="text-2xl font-bold bg-purple-400 text-white px-6 py-2 rounded-t">Application</h2>
		</div>
		<div class="max-w-8xl mx-auto">
			<div v-if="applicant" class="flex flex-col md:flex-row gap-6">
				<!-- Right: Applicant Details Card -->
				<div class="flex-1 bg-white rounded shadow p-6 md:p-8 border border-gray-100">
					<!-- Top Row: Back and Job Offer Button -->
					<div class="flex flex-wrap items-center w-full mb-1 gap-x-4 gap-y-2">
						<button @click="goBack" class="flex items-center text-purple-500 hover:text-green-700 font-semibold w-fit">
							<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
							Back
						</button>
						<button
							class="px-6 py-2 bg-green-500 text-white font-bold rounded shadow border-2 border-green-300 cursor-default w-fit ml-0 md:ml-[4rem]"
							disabled
						>
							Job Offer
						</button>
					</div>
					<div class="flex flex-col md:flex-row md:items-start gap-6">
						<img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Avatar" class="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-gray-200 shadow mb-4 md:mb-0 flex-shrink-0 mx-auto md:mx-0" />
						<div class="flex-1 min-w-0">
							<div class="w-full">
								<div class="text-2xl font-bold text-gray-700 truncate">{{ applicant.name }}</div>
								<div class="text-lg text-gray-500 font-semibold truncate">{{ applicant.position }}</div>
								<div class="text-sm text-gray-400 truncate">{{ applicant.location }}</div>
								<div class="text-sm text-gray-400 truncate">{{ applicant.email }} | {{ applicant.contact }}</div>
							</div>
							<div class="mt-6 grid grid-cols-1 gap-8">
								<div>
									<div class="font-bold mb-1">Work Experience</div>
									<div class="font-semibold text-gray-700">Talent Aquisition</div>
									<div class="text-gray-500">GoPayr | July 2023 - October 2023</div>
									<ul class="list-disc ml-6 text-gray-500 text-sm">
										<li>Sourcing applicants for a specific positions</li>
										<li>Leads mining in jobstreet and linkedin</li>
										<li>Formatted applicants’ resume</li>
									</ul>
									<div class="text-xs text-red-600 font-semibold mt-1">Reason for leaving<br>Low salary</div>
									<div class="font-bold mt-4 mb-1">Educational Background</div>
									<div class="font-semibold text-gray-700">Bachelor of Science in Psychology</div>
									<div class="text-gray-500">University of San Jose - Recolets</div>
									<div class="text-gray-400 text-xs">May 2024</div>
									<div class="font-bold mt-4 mb-1">Recognition</div>
									<ul class="list-disc ml-6 text-gray-500 text-sm">
										<li>Graduate with Honors</li>
										<li>Deans’ Lister</li>
										<li>Best in Math</li>
									</ul>
								</div>
								<div>
									<div class="font-bold mb-1">Skills</div>
									<ul class="list-disc ml-6 text-gray-500 text-sm">
										<li>Time management skills</li>
										<li>Creative</li>
										<li>Organizational skills</li>
										<li>Computer literate</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<!-- Left: Job Offer Form Card -->
				<div class="md:w-1/2 w-full flex flex-col justify-start">
					<div class="bg-white rounded shadow p-8 border border-gray-100 w-full">
						<form class="flex flex-col gap-3 text-sm">
							<div class="flex flex-col md:flex-row items-stretch md:items-center gap-1 md:gap-2">
								<label class="font-semibold text-gray-700 w-full md:w-40 min-w-[120px] text-left md:text-end">Job Offer Date</label>
								<input type="date" class="input input-bordered w-full md:flex-1" v-model="form.jobOfferDate" />
							</div>
							<div class="flex flex-col md:flex-row items-stretch md:items-center gap-1 md:gap-2">
								<label class="font-semibold text-gray-700 w-full md:w-40 min-w-[120px] text-left md:text-end">Name</label>
								<input type="text" class="input input-bordered w-full md:flex-1" placeholder="Full Name" v-model="form.name" />
							</div>
							<div class="flex flex-col md:flex-row items-stretch md:items-center gap-1 md:gap-2">
								<label class="font-semibold text-gray-700 w-full md:w-40 min-w-[120px] text-left md:text-end">Address</label>
								<input type="text" class="input input-bordered w-full md:flex-1" placeholder="Address" v-model="form.address" />
							</div>
							<div class="flex flex-col md:flex-row items-stretch md:items-center gap-1 md:gap-2">
								<label class="font-semibold text-gray-700 w-full md:w-40 min-w-[120px] text-left md:text-end">Position</label>
								<select class="input input-bordered w-full md:flex-1" v-model="form.position">
									<option value="">Select position</option>
									<option v-for="pos in uniquePositions" :key="pos" :value="pos">{{ pos }}</option>
								</select>
								<select class="input input-bordered w-full md:w-32 mt-1 md:mt-0" v-model="form.designation" :disabled="!form.position">
									<option value="">Designation</option>
									<option v-for="sub in positionOptions[form.position] || []" :key="sub" :value="sub">{{ sub }}</option>
								</select>
							</div>
							<div class="flex flex-col md:flex-row items-stretch md:items-center gap-1 md:gap-2">
								<label class="font-semibold text-gray-700 w-full md:w-40 min-w-[120px] text-left md:text-end">Onboarding Date</label>
								<input type="date" class="input input-bordered w-full md:flex-1" v-model="form.onboardingDate" />
							</div>
							<div class="flex flex-col md:flex-row items-stretch md:items-center gap-1 md:gap-2">
								<label class="font-semibold text-gray-700 w-full md:w-40 min-w-[120px] text-left md:text-end">Shift</label>
								<select class="input input-bordered w-full md:flex-1" v-model="form.shift">
									<option value="">Select shift</option>
									<option>Day</option>
									<option>Night w/ NSD</option>
									<option>Night w/o NSD</option>
								</select>
							</div>
							<div class="flex flex-col md:flex-row items-stretch md:items-center gap-1 md:gap-2">
								<label class="font-semibold text-gray-700 w-full md:w-40 min-w-[120px] text-left md:text-end">Time</label>
								<select class="input input-bordered w-full md:flex-1" v-model="form.time">
									<option value="">Select time</option>
									<option>7:00 AM - 4:00 PM</option>
									<option>7:15 AM - 4:15 PM</option>
									<option>9:00 AM - 6:00 PM</option>
									<option>10:00 AM - 7:00 PM</option>
								</select>
							</div>
							<div class="flex flex-col md:flex-row items-stretch md:items-center gap-1 md:gap-2">
								<label class="font-semibold text-gray-700 w-full md:w-40 min-w-[120px] text-left md:text-end">Requirement Deadline</label>
								<input type="date" class="input input-bordered w-full md:flex-1" v-model="form.requirementDeadline" />
							</div>
							<div class="flex flex-col md:flex-row items-stretch md:items-center gap-1 md:gap-2">
								<label class="font-semibold text-gray-700 w-full md:w-40 min-w-[120px] text-left md:text-end">Salary</label>
								<select class="input input-bordered w-full md:flex-1" v-model="form.salary">
									<option value="">Select salary</option>
									<option>₱15,000</option>
									<option>₱18,000</option>
									<option>₱20,000</option>
									<option>₱25,000</option>
								</select>
							</div>
							<div class="flex justify-end md:justify-end mt-2">
								<button @click="handleGenerateClick" type="button" class="w-full md:w-auto px-6 py-2 rounded bg-purple-500 text-white font-semibold hover:bg-purple-600">Generate</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			<div v-else class="max-w-3xl mx-auto bg-white rounded-xl shadow p-8 mt-8 text-center text-red-600 font-bold">
				Applicant not found.
			</div>
		</div>

		<!-- Confirmation Modal -->
		<transition name="modal-fade">
			<div v-if="showConfirmationModal" class="fixed inset-0 z-50 rounded flex items-center justify-center bg-black bg-opacity-50">
				<div class="bg-white rounded shadow-xl p-4 w-full max-w-sm mx-4 sm:mx-0">
					<h3 class="text-lg font-bold mb-4">Confirm Generation</h3>
					<p class="text-sm text-gray-600 mb-6">Are you sure you want to generate the PDF with the provided details?</p>
					<div class="flex justify-end gap-4">
						<button @click="showConfirmationModal = false" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm font-semibold">Cancel</button>
						<button @click="generateAndDownloadPDF" class="px-4 py-2 rounded bg-purple-500 text-white hover:bg-purple-600 text-sm font-semibold">Confirm</button>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'
import jsPDF from 'jspdf'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const route = useRoute()
const router = useRouter()
const applicants = [
	{ position: 'HR Recruitment', name: 'Susan Margaret Adams', location: 'Test location', dateApplied: 'August 3, 2023', email: 'sadams@gmail.com', contact: '09285483729', salary: 18000 },
	{ position: 'SMM Specialist', name: 'Richard Andrew Martinez', location: 'Test location', dateApplied: 'March 26, 2024', email: 'rmartinez@gmail.com', contact: '09878378554', salary: 17000 },
]
const uniquePositions = computed(() => {
	return [...new Set(applicants.map(a => a.position))]
})
// Main position to sub-position mapping
const positionOptions: Record<string, string[]> = {
	'HR Recruitment': ['FDG', 'HR Generalist', 'Recruitment Specialist'],
	'SMM Specialist': ['Content Creator', 'Social Media Analyst'],
}

const form = ref({
	jobOfferDate: '',
	name: '',
	address: '',
	position: '',
	designation: '',
	onboardingDate: '',
	shift: '',
	time: '',
	requirementDeadline: '',
	salary: ''
})

watch(() => form.value.position, (val) => {
	// Reset sub-position if main position changes
	form.value.designation = ''
})

const applicant = computed(() => {
	const idx = Number(route.params.id)
	if (isNaN(idx) || idx < 0 || idx >= applicants.length) return null
	return applicants[idx]
})

const showConfirmationModal = ref(false)

function handleGenerateClick() {
    const fields = {
        'Job Offer Date': form.value.jobOfferDate,
        'Name': form.value.name,
        'Address': form.value.address,
        'Position': form.value.position,
        'Designation': form.value.designation,
        'Onboarding Date': form.value.onboardingDate,
        'Shift': form.value.shift,
        'Time': form.value.time,
        'Requirement Deadline': form.value.requirementDeadline,
        'Salary': form.value.salary,
    }

    let isValid = true;
    for (const [key, value] of Object.entries(fields)) {
        if (!value) {
            toast.error(`${key} is required.`);
            isValid = false;
        }
    }

    if (isValid) {
        showConfirmationModal.value = true;
    }
}

function generateAndDownloadPDF() {
    const fields = {
        'Job Offer Date': form.value.jobOfferDate,
        'Name': form.value.name,
        'Address': form.value.address,
        'Position': form.value.position,
        'Designation': form.value.designation,
        'Onboarding Date': form.value.onboardingDate,
        'Shift': form.value.shift,
        'Time': form.value.time,
        'Requirement Deadline': form.value.requirementDeadline,
        'Salary': form.value.salary,
    }

    const doc = new jsPDF();
    doc.text("Job Offer Details", 20, 20);
    doc.setFontSize(12);
    let y = 30;

    for (const [key, value] of Object.entries(fields)) {
        doc.text(`${key}:`, 20, y);
        doc.text(value as string, 70, y);
        y += 10;
    }

    doc.save(`job-offer-${form.value.name || 'applicant'}.pdf`);
    toast.success("PDF generated successfully!");
    showConfirmationModal.value = false;
}

function goBack() {
	router.push('/applicant-directory/job-offer-applicants')
}
</script>

<style scoped>
</style>
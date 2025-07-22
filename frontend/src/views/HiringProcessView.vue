<template>
<div class="bg-gray-100 p-0 m-0">
	<div class="max-w-7xl mx-auto bg-white rounded shadow p-8 mt-8">
		<!-- <div class="flex flex-wrap items-center w-full mb-1 gap-x-4 gap-y-2">
			<button @click="goBack" class="flex items-center text-purple-500 hover:text-purple-700 font-semibold">
				<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
				Back to Shortlisted
			</button>
		</div> -->
		<div class="mb-6">
			<h2 class="text-2xl font-bold">Hiring Process</h2>
			<div class="mt-2 text-lg font-semibold">
				<span class="text-purple-700">{{ applicant.name }}</span>
				<span class="text-gray-500"> | {{ applicant.position }} Applicant</span>
			</div>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
			<!-- Phone Screening -->
			<div class="rounded border shadow bg-white flex flex-col relative">
				<div class="bg-purple-600 text-white font-bold rounded-t py-2 relative flex items-center justify-center">
					<span>Phone Screening</span>
					<span
						v-if="phases.phone.status === 'For Initial Interview'"
						class="absolute right-4 flex items-center"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
						</svg>
					</span>
				</div>
				<div class="p-4 flex flex-col gap-3">
					<label class="text-xs font-semibold">Schedule <input type="date" class="input input-bordered w-full mt-1" v-model="phases.phone.schedule" /></label>
					<label class="text-xs font-semibold flex items-center gap-2">Notes
						<div class="relative flex-1 flex items-center">
							<template v-if="phases.phone.notes">
								<span
									class="inline-flex items-center bg-purple-100 text-purple-800 rounded-full px-3 py-1 mt-1 max-w-[180px] w-auto cursor-pointer select-none gap-2 overflow-hidden"
									@click="showNoteModal = true"
									style="min-width: 0;"
								>
									<span class="truncate" style="max-width: 100px;">{{ phases.phone.notes.length > 30 ? phases.phone.notes.slice(0, 30) + '…' : phases.phone.notes }}</span>
									<button
										class="ml-1 text-gray-400 hover:text-red-500 focus:outline-none bg-white rounded-full w-5 h-5 flex items-center justify-center border border-gray-300 flex-shrink-0"
										@click.stop="phases.phone.notes = ''"
										title="Clear Note"
										type="button"
									>
										<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
									</button>
								</span>
							</template>
							<template v-else>
								<input
									type="text"
									class="input input-bordered w-full pl-8 pr-2 py-1 rounded-full focus:ring-2 focus:ring-purple-400 truncate"
									:placeholder="'Add Note'"
									readonly
									value=""
									style="padding-left: 30px;"
								/>
								<button
									class="absolute left-1 top-1/2 -translate-y-1/2 bg-purple-400 hover:bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow"
									@click="showNoteModal = true"
									title="Add Note"
									type="button"
								>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
								</button>
							</template>
						</div>
					</label>
					<label class="text-xs font-semibold">Status
						<select v-model="phases.phone.status" class="input input-bordered w-full mt-1">
							<option value="">Select status</option>
							<option value="For Initial Interview">For Initial Interview</option>
							<option value="For Recontact">For Recontact</option>
							<option value="Failed">Failed</option>
							<option value="Withdrawn">Withdrawn</option>
							<option value="No Answer">No Answer</option>
						</select>
					</label>
				</div>
				<!-- Green overlay when checked -->
				<div
					v-if="phases.phone.status === 'For Initial Interview'"
					class="absolute inset-0 bg-green-500 bg-opacity-20 rounded-xl z-10 pointer-events-none select-none"
				></div>
			</div>

			<!-- Initial Interview -->
			<div class="rounded border shadow bg-white flex flex-col relative">
				<div class="bg-purple-600 text-white font-bold rounded-t py-2 relative flex items-center justify-center">
					<span>Initial Interview</span>
					<span
						v-if="phases.initial.status === 'Passed'"
						class="absolute right-4 flex items-center"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
						</svg>
					</span>
				</div>
				<div class="p-4 flex flex-col gap-3">
					<label class="text-xs font-semibold">Schedule <input type="date" class="input input-bordered w-full mt-1" v-model="phases.initial.schedule" :disabled="!canEditInitialInterview" /></label>
					<label class="text-xs font-semibold">Time <input type="time" class="input input-bordered w-full mt-1" v-model="phases.initial.time" :disabled="!canEditInitialInterview" /></label>
					<label class="text-xs font-semibold flex items-center gap-2">Notes
						<div class="relative flex-1 flex items-center">
							<template v-if="phases.initial.notes">
								<span
									class="inline-flex items-center bg-purple-100 text-purple-800 rounded-full px-3 py-1 mt-1 max-w-[180px] w-auto cursor-pointer select-none gap-2 overflow-hidden"
									@click="showInitialNoteModal = true"
									style="min-width: 0;"
								>
									<span class="truncate" style="max-width: 130px;">{{ phases.initial.notes.length > 30 ? phases.initial.notes.slice(0, 30) + '…' : phases.initial.notes }}</span>
									<button
										class="ml-1 text-gray-400 hover:text-red-500 focus:outline-none bg-white rounded-full w-5 h-5 flex items-center justify-center border border-gray-300 flex-shrink-0"
										@click.stop="phases.initial.notes = ''"
										title="Clear Note"
										type="button"
										:disabled="!canEditInitialInterview"
									>
										<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
									</button>
								</span>
							</template>
							<template v-else>
								<input
									type="text"
									class="input input-bordered w-full pl-8 pr-2 py-1 rounded-full focus:ring-2 focus:ring-purple-400 truncate"
									:placeholder="'Add Note'"
									readonly
									value=""
									style="padding-left: 30px;"
									:disabled="!canEditInitialInterview"
								/>
								<button
									class="absolute left-1 top-1/2 -translate-y-1/2 bg-purple-400 hover:bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow"
									@click="showInitialNoteModal = true"
									title="Add Note"
									type="button"
									:disabled="!canEditInitialInterview"
								>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
								</button>
							</template>
						</div>
					</label>
					<label class="text-xs font-semibold">Status
						<select v-model="phases.initial.status" class="input input-bordered w-full mt-1" :disabled="!canEditInitialInterview">
							<option value="">Select status</option>
							<option value="Passed">Passed</option>
							<option value="Reschedule">Reschedule</option>
							<option value="For Pooling">For Pooling</option>
							<option value="Failed">Failed</option>
							<option value="Withdrawn">Withdrawn</option>
							<option value="No Show">No Show</option>
						</select>
					</label>
					<!-- <div class="text-xs text-purple-700 mt-1">Please set both a <b>Schedule Date</b> and <b>Time</b> before updating the status.</div> -->
				</div>
				<!-- Green overlay when checked -->
				<div
					v-if="phases.initial.status === 'Passed'"
					class="absolute inset-0 bg-green-500 bg-opacity-20 rounded-xl z-10 pointer-events-none select-none"
				></div>
				<!-- Existing overlay for disabled -->
				<div v-if="!canEditInitialInterview && phases.phone.status !== 'For Initial Interview'" class="absolute inset-0 bg-black bg-opacity-30 rounded z-10 flex items-center justify-center pointer-events-auto select-none"></div>
			</div>

			<!-- Hands-on Exam -->
			<div class="rounded border shadow bg-white flex flex-col relative">
				<div class="bg-purple-600 text-white font-bold rounded-t py-2 relative flex items-center justify-center">
					<span>Hands-on Exam</span>
					<!-- Show check icon if status is Final Interview, else show skip button -->
					<span v-if="phases.exam.status === 'Final Interview'" class="absolute right-4 flex items-center">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
						</svg>
					</span>
					<button
						v-else
						class="text-xs bg-gray-200 text-gray-700 rounded px-2 py-0.5 ml-2 absolute right-4"
						:disabled="!canEditHandsOnExam"
						@click="skipHandsOnExam"
					>
						Skip
					</button>
				</div>
				<div class="p-4 flex flex-col gap-3">
					<label class="text-xs font-semibold">Schedule <input type="date" class="input input-bordered w-full mt-1" v-model="phases.exam.schedule" :disabled="!canEditHandsOnExam" /></label>
					<label class="text-xs font-semibold">Time <input type="time" class="input input-bordered w-full mt-1" v-model="phases.exam.time" :disabled="!canEditHandsOnExam" /></label>
					<label class="text-xs font-semibold">Type of Exam
						<select v-model="phases.exam.type" class="input input-bordered w-full mt-1" :disabled="!canEditHandsOnExam">
							<option value="">Select type</option>
							<option v-for="type in examTypeOptions" :key="type" :value="type">{{ type }}</option>
						</select>
					</label>
					<label class="text-xs font-semibold">Exam Duration
						<input class="input input-bordered w-full mt-1" v-model="examDurationInput" :disabled="!canEditHandsOnExam" placeholder="Enter number of hours" />
					</label>
					<label class="text-xs font-semibold">Status
						<select v-model="phases.exam.status" class="input input-bordered w-full mt-1" :disabled="!canEditHandsOnExam">
							<option value="">Select status</option>
							<option value="Final Interview">Final Interview</option>
							<option value="Failed">Failed</option>
							<option value="Withdrawn">Withdrawn</option>
							<option value="No Show">No Show</option>
						</select>
					</label>
				</div>
				<!-- Green overlay when checked -->
				<div
					v-if="phases.exam.status === 'Final Interview'"
					class="absolute inset-0 bg-green-500 bg-opacity-20 rounded-xl z-10 pointer-events-none select-none"
				></div>
				<div v-if="!canEditHandsOnExam" class="absolute inset-0 bg-black bg-opacity-30 rounded z-10 flex items-center justify-center pointer-events-auto select-none"></div>
			</div>

			<!-- Final Interview -->
			<div class="rounded border shadow bg-white flex flex-col relative">
				<div class="bg-purple-600 text-white font-bold rounded-t py-2 relative flex items-center justify-center">
					<span>Final Interview</span>
					<span
						v-if="phases.final.status === 'For Job Offer'"
						class="absolute right-4 flex items-center"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
						</svg>
					</span>
				</div>
				<div class="p-4 flex flex-col gap-3">
					<label class="text-xs font-semibold">Schedule <input type="date" class="input input-bordered w-full mt-1" v-model="phases.final.schedule" :disabled="!canEditFinalInterview" /></label>
					<label class="text-xs font-semibold">Time <input type="time" class="input input-bordered w-full mt-1" v-model="phases.final.time" :disabled="!canEditFinalInterview" /></label>
					<label class="text-xs font-semibold">Status
						<select v-model="phases.final.status" class="input input-bordered w-full mt-1" :disabled="!canEditFinalInterview">
							<option value="">Select status</option>
							<option value="For Job Offer">For Job Offer</option>
							<option value="Passed">Passed</option>
							<option value="Failed">Failed</option>
							<option value="Withdrawn">Withdrawn</option>
							<option value="No Show">No Show</option>
						</select>
					</label>
				</div>
				<!-- Green overlay when checked -->
				<div
					v-if="phases.final.status === 'For Job Offer'"
					class="absolute inset-0 bg-green-500 bg-opacity-20 rounded z-10 pointer-events-none select-none"
				></div>
				<div v-if="!canEditFinalInterview" class="absolute inset-0 bg-black bg-opacity-30 rounded z-10 flex items-center justify-center pointer-events-auto select-none"></div>
			</div>
		</div>
	</div>
</div>
<NotebookModal
	v-if="showNoteModal"
	v-model="phases.phone.notes"
	@close="showNoteModal = false"
/>
<NotebookModal
	v-if="showInitialNoteModal"
	v-model="phases.initial.notes"
	@close="showInitialNoteModal = false"
/>
<!-- Status Confirmation Modal -->
<transition name="modal-fade">
	<div v-if="showStatusConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
		<div class="bg-white rounded shadow-xl p-6 w-full max-w-xs flex flex-col items-center">
			<h3 class="text-lg font-bold mb-2">Confirm Status Change</h3>
			<p class="mb-4 text-center">Are you sure you want to set status to <span class="font-semibold text-purple-600">{{ pendingStatus }}</span>?</p>
			<div class="flex gap-4">
				<button class="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300" @click="cancelStatusChange">Cancel</button>
				<button class="px-4 py-1 rounded bg-purple-500 text-white hover:bg-purple-600" @click="confirmStatusChange">Confirm</button>
			</div>
		</div>
	</div>
</transition>

<!-- Add confirmation modals for Initial Interview and Hands-on Exam -->
<transition name="modal-fade">
	<div v-if="showInitialStatusConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
		<div class="bg-white rounded shadow-xl p-6 w-full max-w-xs flex flex-col items-center">
			<h3 class="text-lg font-bold mb-2">Confirm Status Change</h3>
			<p class="mb-4 text-center">Are you sure you want to set Initial Interview status to <span class="font-semibold text-purple-600">{{ pendingInitialStatus }}</span>?</p>
			<div class="flex gap-4">
				<button class="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300" @click="cancelInitialStatusChange">Cancel</button>
				<button class="px-4 py-1 rounded bg-purple-500 text-white hover:bg-purple-600" @click="confirmInitialStatusChange">Confirm</button>
			</div>
		</div>
	</div>
</transition>

<transition name="modal-fade">
	<div v-if="showExamStatusConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
		<div class="bg-white rounded shadow-xl p-6 w-full max-w-xs flex flex-col items-center">
			<h3 class="text-lg font-bold mb-2">Confirm Status Change</h3>
			<p class="mb-4 text-center">Are you sure you want to set Hands-on Exam status to <span class="font-semibold text-purple-600">{{ pendingExamStatus }}</span>?</p>
			<div class="flex gap-4">
				<button class="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300" @click="cancelExamStatusChange">Cancel</button>
				<button class="px-4 py-1 rounded bg-purple-500 text-white hover:bg-purple-600" @click="confirmExamStatusChange">Confirm</button>
			</div>
		</div>
	</div>
</transition>

<!-- Add confirmation modal for Final Interview in the template -->
<transition name="modal-fade">
	<div v-if="showFinalStatusConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
		<div class="bg-white rounded shadow-xl p-6 w-full max-w-xs flex flex-col items-center">
			<h3 class="text-lg font-bold mb-2">Confirm Status Change</h3>
			<p class="mb-4 text-center">Are you sure you want to set Final Interview status to <span class="font-semibold text-purple-600">{{ pendingFinalStatus }}</span>?</p>
			<div class="flex gap-4">
				<button class="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300" @click="cancelFinalStatusChange">Cancel</button>
				<button class="px-4 py-1 rounded bg-purple-500 text-white hover:bg-purple-600" @click="confirmFinalStatusChange">Confirm</button>
			</div>
		</div>
	</div>
</transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NotebookModal from '@/components/NotebookModal.vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
const route = useRoute()
const router = useRouter()

// Use the same applicants array as in ShortlistedApplicantsView.vue
const applicants = [
	{ position: 'HR Recruitment', name: 'John Michael Smith', dateApplied: 'July 31, 2024', email: 'jmsmith@gmail.com', contact: '09285483729', salary: 18000, shortlistingDate: 'August 1, 2024', status: 'For Initial Interview' },
	{ position: 'PHP Developer', name: 'Mary Elizabeth Johnson', dateApplied: 'June 25, 2023', email: 'mjohson@gmail.com', contact: '09878886534', salary: 21000, shortlistingDate: 'June 27, 2023', status: 'For Recontact' },
	{ position: 'SMM Specialist', name: 'Patricia Anne Thompson', dateApplied: 'May 11, 2024', email: 'pthompson@gmail.com', contact: '09876937854', salary: 17000, shortlistingDate: 'May 13, 2024', status: 'For Initial Interview' },
	{ position: 'SEO Analyst', name: 'Jenifer Lynn Rodriguez', dateApplied: 'March 11, 2024', email: 'jrodriguez@gmail.com', contact: '09898048271', salary: 13000, shortlistingDate: 'March 15, 2024', status: 'No Answer', reapplicant: true },
	{ position: 'Web Designer', name: 'Linda Marie Clark', dateApplied: 'February 19, 2024', email: 'lclark@gmail.com', contact: '09849372492', salary: 12000, shortlistingDate: 'February 21, 2024', status: 'Failed' },
	{ position: 'HR Recruitment', name: 'Elizabeth Ann Scott', dateApplied: 'January 7, 2024', email: 'escott@gmail.com', contact: '09835057483', salary: 12000, shortlistingDate: 'January 10, 2024', status: 'Withdrawn' },
	{ position: 'Web Developer', name: 'Michael Joseph Garcia', dateApplied: 'January 5, 2024', email: 'mjgarcia@gmail.com', contact: '09123217589', salary: 18000, shortlistingDate: 'January 7, 2024', status: 'Failed' },
	{ position: 'Web Developer', name: 'Barbara Jean Hernandez', dateApplied: 'January 5, 2024', email: 'bhernandez@gmail.com', contact: '09898923153', salary: 40000, shortlistingDate: 'January 8, 2024', status: 'No Answer' },
]

const applicant = computed(() => {
const idx = Number(route.params.id)
	if (isNaN(idx) || idx < 0 || idx >= applicants.length) return { name: 'Unknown', position: '' }
	return applicants[idx]
})

const phases = ref({
	phone: { schedule: '', notes: '', status: '' },
	initial: { schedule: '', time: '', notes: '', status: '' },
	exam: { schedule: '', time: '', type: '', duration: '', status: '' },
	final: { schedule: '', time: '', status: '' },
})

const showNoteModal = ref(false)
const showInitialNoteModal = ref(false)

// Only allow editing Initial Interview if Phone Screening status is 'For Initial Interview'
const canEditInitialInterview = computed(() => phases.value.phone.status === 'For Initial Interview')

// Add computed properties for enabling Hands-on and Final Interview
const canEditHandsOnExam = computed(() => phases.value.initial.status === 'Passed')
const canEditFinalInterview = computed(() => phases.value.exam.status === 'Final Interview')

const prevPhoneStatus = ref(phases.value.phone.status)
const showStatusConfirmModal = ref(false)
const pendingStatus = ref('')
let isRevertingStatus = false
let isConfirmingStatusChange = false // <-- Add this flag
watch(() => phases.value.phone.status, async (newStatus, oldStatus) => {
	if (isRevertingStatus) {
		isRevertingStatus = false
		return
	}
	if (isConfirmingStatusChange) { // <-- Skip modal logic if confirming
		isConfirmingStatusChange = false
		prevPhoneStatus.value = newStatus
		return
	}
	if (newStatus === oldStatus) return
	// Always show confirmation modal for any new status selection
	if (!phases.value.phone.schedule) {
		toast.warn('Please set a "Schedule Date" before updating the status.')
		await nextTick()
		isRevertingStatus = true
		phases.value.phone.status = prevPhoneStatus.value
		return
	}
	if (newStatus) {
		pendingStatus.value = newStatus
		await nextTick()
		isRevertingStatus = true
		phases.value.phone.status = prevPhoneStatus.value
		showStatusConfirmModal.value = true
		return
	}
  // Do not update prevPhoneStatus here; only update on confirm
})
function confirmStatusChange() {
	isConfirmingStatusChange = true
	prevPhoneStatus.value = pendingStatus.value
	phases.value.phone.status = pendingStatus.value
	showStatusConfirmModal.value = false
	// toast.success(`Applicant Phone Screening status set to: <b>${pendingStatus.value}</b>`)
	toast.success(
		h('div', [
			'Applicant Phone Screening status set to: ',
			h('b', pendingStatus.value)
		])
	);
}
function cancelStatusChange() {
	isRevertingStatus = true
	phases.value.phone.status = prevPhoneStatus.value
	showStatusConfirmModal.value = false
}

// Add previous status tracking and watcher for Initial Interview status
const prevInitialStatus = ref(phases.value.initial.status)
let isRevertingInitialStatus = false
let isConfirmingInitialStatusChange = false

// Add examTypeOptions for dropdown
const examTypeOptions = [
	'Content Editor',
	'FDG',
	'Graphic Designer',
	'IS Team',
	'IT Staff',
	'PDQA',
	'SP Team',
	'VPE',
	'Web Conversion',
	'Web Designer',
	'Web Modifier',
]
// Add examDurationInput for handling hour/hours
const examDurationInput = ref('')
watch(examDurationInput, (val) => {
	if (!val) {
		phases.value.exam.duration = ''
		return
	}
	const num = parseInt(val)
	if (!isNaN(num)) {
		phases.value.exam.duration = num + (num === 1 ? ' hour' : ' hours')
	} else {
		phases.value.exam.duration = val
	}
})
// Watch for status change to 'Final Interview' or skip
const prevExamStatus = ref(phases.value.exam.status)
let isRevertingExamStatus = false
let isConfirmingExamStatusChange = false
let isSkipExam = false
watch(() => phases.value.exam.status, async (newStatus, oldStatus) => {
	if (isRevertingExamStatus) {
		isRevertingExamStatus = false
		return
	}
	if (isConfirmingExamStatusChange) {
		isConfirmingExamStatusChange = false
		prevExamStatus.value = newStatus
		return
	}
	if (newStatus === oldStatus) return

	// If skip button was used, allow modal
	if (isSkipExam) {
	isSkipExam = false
	if (newStatus) {
		pendingExamStatus.value = newStatus
		isRevertingExamStatus = true
		phases.value.exam.status = prevExamStatus.value
		showExamStatusConfirmModal.value = true
		return
	}
	prevExamStatus.value = newStatus
	return
	}

	// Validate all required fields
	if (!phases.value.exam.schedule || !phases.value.exam.time || !phases.value.exam.type || !phases.value.exam.duration) {
		toast.warn('Please fill out all required fields before updating the status.')
		await nextTick()
		isRevertingExamStatus = true
		phases.value.exam.status = prevExamStatus.value
		return
	}

	// Only show modal if all fields are filled
	if (newStatus) {
		pendingExamStatus.value = newStatus
		isRevertingExamStatus = true
		phases.value.exam.status = prevExamStatus.value
		showExamStatusConfirmModal.value = true
		return
	}
	prevExamStatus.value = newStatus
})
function skipHandsOnExam() {
	isSkipExam = true
	pendingExamStatus.value = 'Final Interview'
	showExamStatusConfirmModal.value = true
}

// Add confirmation modal state for Initial Interview and Hands-on Exam
const showInitialStatusConfirmModal = ref(false)
const showExamStatusConfirmModal = ref(false)
const pendingInitialStatus = ref('')
const pendingExamStatus = ref('')

// Add these for Final Interview modal
const showFinalStatusConfirmModal = ref(false)
const pendingFinalStatus = ref('')

// Update Initial Interview status watcher to include confirmation modal
watch(() => phases.value.initial.status, async (newStatus, oldStatus) => {
	if (isRevertingInitialStatus) {
		isRevertingInitialStatus = false
		return
	}
	if (isConfirmingInitialStatusChange) {
		isConfirmingInitialStatusChange = false
		prevInitialStatus.value = newStatus
		return
	}
	if (newStatus === oldStatus) return
	if (!phases.value.initial.schedule || !phases.value.initial.time) {
		toast.warn('Please set both a "Schedule Date" and "Time" before updating the status.')
		await nextTick()
		isRevertingInitialStatus = true
		phases.value.initial.status = prevInitialStatus.value
		return
	}
	if (newStatus) {
		pendingInitialStatus.value = newStatus
		await nextTick()
		isRevertingInitialStatus = true
		phases.value.initial.status = prevInitialStatus.value
		showInitialStatusConfirmModal.value = true
		return
	}
})

// Add confirmation functions for Initial Interview
function confirmInitialStatusChange() {
	isConfirmingInitialStatusChange = true
	prevInitialStatus.value = pendingInitialStatus.value
	phases.value.initial.status = pendingInitialStatus.value
	showInitialStatusConfirmModal.value = false
	toast.success(`Initial Interview status set to: ${pendingInitialStatus.value}`)
}

function cancelInitialStatusChange() {
	isRevertingInitialStatus = true
	phases.value.initial.status = prevInitialStatus.value
	showInitialStatusConfirmModal.value = false
}

// Add confirmation functions for Hands-on Exam
function confirmExamStatusChange() {
	isConfirmingExamStatusChange = true
	prevExamStatus.value = pendingExamStatus.value
	phases.value.exam.status = pendingExamStatus.value
	showExamStatusConfirmModal.value = false
	toast.success(`Hands-on Exam status set to: ${pendingExamStatus.value}`)
}

function cancelExamStatusChange() {
	isRevertingExamStatus = true
	phases.value.exam.status = prevExamStatus.value
	showExamStatusConfirmModal.value = false
}

// Add previous status tracking and watcher for Final Interview status
const prevFinalStatus = ref(phases.value.final.status)
let isRevertingFinalStatus = false
let isConfirmingFinalStatusChange = false
watch(() => phases.value.final.status, async (newStatus, oldStatus) => {
	if (isRevertingFinalStatus) {
		isRevertingFinalStatus = false
		return
	}
	if (isConfirmingFinalStatusChange) {
		isConfirmingFinalStatusChange = false
		prevFinalStatus.value = newStatus
		return
	}
	if (newStatus === oldStatus) return
	if (!phases.value.final.schedule || !phases.value.final.time) {
		toast.warn('Please set both a "Schedule Date" and "Time" before updating the status.')
		await nextTick()
		isRevertingFinalStatus = true
		phases.value.final.status = prevFinalStatus.value
		return
	}
	if (newStatus) {
		pendingFinalStatus.value = newStatus
		await nextTick()
		isRevertingFinalStatus = true
		phases.value.final.status = prevFinalStatus.value
		showFinalStatusConfirmModal.value = true
		return
	}
})
function confirmFinalStatusChange() {
	isConfirmingFinalStatusChange = true
	prevFinalStatus.value = pendingFinalStatus.value
	phases.value.final.status = pendingFinalStatus.value
	showFinalStatusConfirmModal.value = false
	toast.success(`Final Interview status set to: ${pendingFinalStatus.value}`)
}
function cancelFinalStatusChange() {
	isRevertingFinalStatus = true
	phases.value.final.status = prevFinalStatus.value
	showFinalStatusConfirmModal.value = false
}

function goBack() {
	router.push('/applicant-directory/shortlisted-applicants')
}
</script>

<style scoped>
.input {
	@apply border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400;
}
.modal-fade-enter-active, .modal-fade-leave-active {
	transition: opacity 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1);
}
.modal-fade-enter-from, .modal-fade-leave-to {
	opacity: 0;
	transform: scale(0.95);
}
.modal-fade-enter-to, .modal-fade-leave-from {
	opacity: 1;
	transform: scale(1);
}
</style>
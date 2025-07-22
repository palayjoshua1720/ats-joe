<template>
	<div class="bg-gray-100 p-0 m-0">
		<!-- Application Title Box outside the card -->
		<div class="flex items-center max-w-7xl mx-auto">
			<h2 class="text-2xl font-bold bg-purple-400 text-white px-6 py-2 rounded-t">Application</h2>
		</div>
		<div class="max-w-7xl mx-auto bg-white rounded-b rounded-r shadow p-8" v-if="applicant">
			<div class="flex flex-wrap items-center w-full mb-1 gap-x-4 gap-y-2">
				<button @click="goBack" class="mb-4 flex items-center text-purple-500 hover:text-purple-700 font-semibold">
					<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
					Back
				</button>
				<div class="flex gap-2 mb-2">
					<template v-if="isShortlisted">
						<button class="px-6 py-2 bg-orange-500 text-white font-bold rounded shadow border-2 border-orange-300 cursor-default w-fit ml-0 md:ml-[5rem]" disabled>
							Shortlisted
						</button>
					</template>
					<template v-else>
						<button
							class="flex items-center gap-1 px-4 py-1 bg-green-100 text-green-700 border border-green-400 rounded-full font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed w-fit ml-0 md:ml-[5rem]"
							@click="shortlistApplicant"
						>
							<span class="inline-block w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white">&#10003;</span>
							Shortlisted
						</button>
						<button class="flex items-center gap-1 px-4 py-1 bg-white text-red-600 border border-red-400 rounded-full font-semibold text-sm ">
							<span class="inline-block w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white">&#10005;</span>
							Reject
						</button>
					</template>
					<div v-if="showShortlistedMsg" class="text-green-600 text-sm py-2">Applicant moved to Shortlisted!</div>
				</div>
			</div>
			<div class="flex flex-col md:flex-row gap-8">
				<div class="flex flex-col items-center md:items-start gap-4">
					<img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Avatar" class="w-32 h-32 rounded-full border-4 border-gray-200 shadow" />
					<!-- Clear All Shortlisted Button - For debugging -->
					<!-- <button
						class="mt-2 px-3 py-1 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300 border border-gray-300"
						@click="clearShortlistedApplicants"
					>	
						Clear All Shortlisted
					</button> -->
				</div>
				<!-- Main Info -->
				<div class="flex-1">
					<div class="flex flex-col md:flex-row md:justify-between md:items-center">
						<div>
							<div class="text-2xl font-bold text-gray-700">{{ applicant.name }}</div>
							<div class="text-lg text-gray-500 font-semibold">{{ applicant.position }}</div>
							<div class="text-sm text-gray-400">{{ applicant.email }} | {{ applicant.contact }}</div>
						</div>
					</div>
					<div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
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
		<div v-else class="max-w-3xl mx-auto bg-white rounded-xl shadow p-8 mt-8 text-center text-red-600 font-bold">
			Applicant not found.
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const showShortlistedMsg = ref(false)
const shortlistedState = ref(false)
const applicants = [
	{ position: 'HR Recruitment', name: 'John Michael Smith', date: 'July 31, 2024', email: 'jmsmith@gmail.com', contact: '09285483729', salary: 18000, reapplicant: false },
	{ position: 'PHP Developer', name: 'Mary Elizabeth Johnson', date: 'June 25, 2023', email: 'mjohson@gmail.com', contact: '09878886534', salary: 21000, reapplicant: false },
	{ position: 'SMM Specialist', name: 'Patricia Anne Thompson', date: 'May 11, 2024', email: 'pthompson@gmail.com', contact: '09876937854', salary: 17000, reapplicant: false },
	{ position: 'HR Compensation and Benefits', name: 'William Alexander Johnson', date: 'April 30, 2024', email: 'wjohnson@gmail.com', contact: '09284378567', salary: 14000, reapplicant: false },
	{ position: 'SEO Analyst', name: 'Jenifer Lynn Rodriguez', date: 'March 11, 2024', email: 'jrodriguez@gmail.com', contact: '09898048271', salary: 13000, reapplicant: true },
	{ position: 'FDG', name: 'James Edward Davis', date: 'February 23, 2024', email: 'jdavis@gmail.com', contact: '09893057868', salary: 23000, reapplicant: true },
	{ position: 'Web Designer', name: 'Linda Marie Clark', date: 'February 19, 2024', email: 'lclark@gmail.com', contact: '09849372492', salary: 12000, reapplicant: false },
	{ position: 'HR Recruitment', name: 'Elizabeth Ann Scott', date: 'January 7, 2024', email: 'escott@gmail.com', contact: '09835057483', salary: 12000, reapplicant: false },
	{ position: 'Web Developer', name: 'Michael Joseph Garcia', date: 'January 5, 2024', email: 'mjgarcia@gmail.com', contact: '09123217589', salary: 18000, reapplicant: false },
	{ position: 'Web Developer', name: 'Barbara Jean Hernandez', date: 'January 5, 2024', email: 'bhernandez@gmail.com', contact: '09898923153', salary: 40000, reapplicant: false },
]
const applicant = computed(() => {
	const idx = Number(route.params.id)
	if (isNaN(idx) || idx < 0 || idx >= applicants.length) return null
	return applicants[idx]
})
const isShortlisted = computed(() => {
	if (!applicant.value) return false
	if (shortlistedState.value) return true
	const shortlisted = JSON.parse(localStorage.getItem('shortlistedApplicants') || '[]')
	return !!(applicant.value && shortlisted.find((a: any) => a.email === applicant.value.email))
})
onMounted(() => {
	appStore.setBackTargetPhase(appStore.activePhase)
	// Set initial state for shortlisted
	if (applicant.value) {
		const shortlisted = JSON.parse(localStorage.getItem('shortlistedApplicants') || '[]')
		shortlistedState.value = !!shortlisted.find((a: any) => a.email === applicant.value?.email)
	}
	if (route.query.from === 'petdb') {
		appStore.setActivePhase('Pre-Employment Training Database')
	} 
})
onUnmounted(() => {
	// Restore previous phase if we set PETDB
	if (route.query.from === 'petdb') {
		appStore.setActivePhase(appStore.backTargetPhase)
	}
})
function shortlistApplicant() {
	if (!applicant.value) return
	const app = applicant.value
	let shortlisted = JSON.parse(localStorage.getItem('shortlistedApplicants') || '[]')
	if (!shortlisted.find((a: any) => a.email === app?.email)) {
		shortlisted.push({ ...app, status: 'Shortlisted' })
		localStorage.setItem('shortlistedApplicants', JSON.stringify(shortlisted))
		showShortlistedMsg.value = true
		appStore.setActivePhase('Shortlisted')
		appStore.setBackTargetPhase('Shortlisted')
		shortlistedState.value = true // <-- This triggers reactivity
		toast.success('Applicant successfully shortlisted!')
		sessionStorage.setItem('justShortlisted', '1')
	}
}
function clearShortlistedApplicants() {
	localStorage.removeItem('shortlistedApplicants')
	toast.warn('All shortlisted applicants removed.')
}
function goBack() {
	if (route.query.from === 'petdb') {
		router.push('/pre-employment-training-db')
		return
	}
	if (sessionStorage.getItem('justShortlisted')) {
		sessionStorage.removeItem('justShortlisted')
		router.push('/applicant-directory/shortlisted-applicants')
	} else {
		router.push('/applicant-directory/new-applicants')
	}
}
</script> 
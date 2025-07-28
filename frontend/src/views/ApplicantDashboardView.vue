<template>
	<div class="bg-gray-100 p-0 m-0 dark:bg-[#111827]">
		<!-- Application Title Box outside the card -->
		<div class="flex items-center max-w-6xl mx-auto dark:bg-[#111827]">
			<h2 class="text-2xl font-bold bg-purple-400 text-white px-6 py-2 rounded-t">Application</h2>
		</div>
		<div class="max-w-6xl mx-auto rounded-b rounded-r bg-white shadow p-8 dark:bg-gray-800" v-if="applicant">
			<button @click="goBack" class="mb-4 flex items-center text-purple-500 hover:text-purple-700 font-semibold">
				<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
				Back
			</button>
			<div class="flex flex-col md:flex-row gap-8">
				<!-- Avatar -->
				<div class="flex flex-col items-center md:items-start gap-4">
					<img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Avatar" class="w-32 h-32 rounded-full border-4 border-gray-200 shadow" />
				</div>
				<!-- Main Info -->
				<div class="flex-1">
					<div class="flex flex-col md:flex-row md:justify-between md:items-center">
						<div>
							<div class="text-2xl font-bold text-gray-700 dark:text-white">{{ applicant.name }}</div>
							<div class="text-lg text-gray-500 font-semibold dark:text-gray-300">{{ applicant.position }}</div>
							<div class="text-sm text-gray-400 truncate dark:text-gray-500">{{ applicant.location }}</div>
							<div class="text-sm text-gray-400 dark:text-gray-500">{{ applicant.email }} | {{ applicant.contact }}</div>
						</div>
					</div>
					<div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
						<div>
							<div class="font-bold mb-1">Work Experience</div>
							<div class="font-semibold text-gray-700 dark:text-gray-300">Talent Aquisition</div>
							<div class="text-gray-500 dark:text-gray-500">GoPayr | July 2023 - October 2023</div>
							<ul class="list-disc ml-6 text-gray-500 text-sm dark:text-gray-500">
								<li>Sourcing applicants for a specific positions</li>
								<li>Leads mining in jobstreet and linkedin</li>
								<li>Formatted applicants’ resume</li>
							</ul>
							<div class="text-xs text-red-600 font-semibold mt-1">Reason for leaving<br>Low salary</div>
							<div class="font-bold mt-4 mb-1">Educational Background</div>
							<div class="font-semibold text-gray-700 dark:text-gray-300">Bachelor of Science in Psychology</div>
							<div class="text-gray-500 dark:text-gray-500">University of San Jose - Recolets</div>
							<div class="text-gray-400 text-xs dark:text-gray-500">May 2024</div>
							<div class="font-bold mt-4 mb-1">Recognition</div>
							<ul class="list-disc ml-6 text-gray-500 text-sm dark:text-gray-500">
								<li>Graduate with Honors</li>
								<li>Deans’ Lister</li>
								<li>Best in Math</li>
							</ul>
						</div>
						<div>
							<div class="font-bold mb-1">Skills</div>
							<ul class="list-disc ml-6 text-gray-500 text-sm dark:text-gray-500">
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
import { computed } from 'vue'
const route = useRoute()
const router = useRouter()
const applicants = [
	{ position: 'HR Recruitment', name: 'John Michael Smith', location: "test location", date: 'July 31, 2024', email: 'jmsmith@gmail.com', contact: '09285483729', salary: 18000, reapplicant: false },
	{ position: 'PHP Developer', name: 'Mary Elizabeth Johnson', location: "test location", date: 'June 25, 2023', email: 'mjohson@gmail.com', contact: '09878886534', salary: 21000, reapplicant: false },
	{ position: 'SMM Specialist', name: 'Patricia Anne Thompson', location: "test location", date: 'May 11, 2024', email: 'pthompson@gmail.com', contact: '09876937854', salary: 17000, reapplicant: false },
	{ position: 'HR Compensation and Benefits', name: 'William Alexander Johnson', location: "test location", date: 'April 30, 2024', email: 'wjohnson@gmail.com', contact: '09284378567', salary: 14000, reapplicant: false },
	{ position: 'SEO Analyst', name: 'Jenifer Lynn Rodriguez', location: "test location", date: 'March 11, 2024', email: 'jrodriguez@gmail.com', contact: '09898048271', salary: 13000, reapplicant: true },
	{ position: 'FDG', name: 'James Edward Davis', location: "test location", date: 'February 23, 2024', email: 'jdavis@gmail.com', contact: '09893057868', salary: 23000, reapplicant: true },
	{ position: 'Web Designer', name: 'Linda Marie Clark', location: "test location", date: 'February 19, 2024', email: 'lclark@gmail.com', contact: '09849372492', salary: 12000, reapplicant: false },
	{ position: 'HR Recruitment', name: 'Elizabeth Ann Scott', location: "test location", date: 'January 7, 2024', email: 'escott@gmail.com', contact: '09835057483', salary: 12000, reapplicant: false },
	{ position: 'Web Developer', name: 'Michael Joseph Garcia', location: "test location", date: 'January 5, 2024', email: 'mjgarcia@gmail.com', contact: '09123217589', salary: 18000, reapplicant: false },
	{ position: 'Web Developer', name: 'Barbara Jean Hernandez', location: "test location", date: 'January 5, 2024', email: 'bhernandez@gmail.com', contact: '09898923153', salary: 40000, reapplicant: false },
]
const applicant = computed(() => {
	const idx = Number(route.params.id)
	if (isNaN(idx) || idx < 0 || idx >= applicants.length) return null
	return applicants[idx]
})
function goBack() {
	router.push('/pre-employment-training-db')
}
</script> 
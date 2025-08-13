<template>
	<div class="bg-gray-100 p-0 m-0 dark:bg-[#111827]">
		<!-- Application Title Box outside the card -->
		<div class="flex items-center max-w-8xl mx-auto dark:bg-[#111827] mb-1">
            <button @click="goBack" class="flex items-center text-purple-500 hover:text-purple-700 font-semibold">
                <ChevronLeftIcon class="w-5 h-5 mr-2" />
                Back
            </button>
			<h2 class="text-2xl font-bold ml-3">TrainingAllowance</h2>
		</div>
		<div class="max-w-8xl mx-auto rounded-b rounded-r" v-if="applicants">
			<div class="bg-white p-6 mb-6 shadow dark:bg-gray-800">
                <div class="flex items-center justify-center space-x-4 md:justify-center md:space-x-4 lg:justify-start lg:space-x-6">
                    <button
                        v-if="currentTraineeIndex > 0"
                        @click="previousTrainee"
                        class="btn btn-circle btn-sm bg-purple-500 text-white"
                    >
                        <ChevronLeftIcon class="h-4 w-4" />
                    </button>

                    <div class="text-center md:text-center lg:text-left">
                        <h2 class="text-2xl font-bold text-blue-600 underline dark:text-indigo-400">
                            {{ selectedApplicant.name }}
                        </h2>
                        <p class="text-gray-600 mb-1 text-lg font-semibold dark:text-gray-300">
                            {{ selectedApplicant.position }}
                        </p>
                        <p class="text-gray-600 mb-1 text-sm dark:text-gray-500">
                            {{ selectedApplicant.team }}
                        </p>
                        <p class="text-gray-600 mb-1 text-sm dark:text-gray-500 font-semibold">
                            <!-- {{ selectedApplicant.office }} -->
                            {{ selectedApplicant.trainingDuration }}
                        </p>
                    </div>

                    <button
                        v-if="currentTraineeIndex < applicants.length - 1"
                        @click="nextTrainee"
                        class="btn btn-circle btn-sm bg-purple-500 text-white"
                    >
                        <ChevronRightIcon class="h-4 w-4" />
                    </button>
                </div>
            </div>

            
            <div class="flex flex-col lg:flex-row bg-white shadow dark:bg-gray-800 gap-4 p-4">
                <!-- left side -->
                <div class="rounded p-4 md:p-6 w-full lg:w-1/2 max-w-3xl">
                    <!-- Date Range -->
                    <div class="flex flex-col md:flex-row text-center">
                        <div class="flex-1 border border-purple-300 px-2 md:px-4 py-3 md:py-6">
                            <h1 class="font-semibold text-lg md:text-2xl">Starting Date</h1>
                            <p class="text-sm md:text-base">
                                {{ selectedApplicant.startingDate ? formatDateToText(selectedApplicant.startingDate) : '' }}
                            </p>
                        </div>
                        <div class="flex-1 border border-purple-300 px-2 md:px-4 py-3 md:py-6">
                            <h1 class="font-semibold text-lg md:text-2xl">End Date</h1>
                            <p class="text-sm md:text-base">
                                {{ selectedApplicant.endDate ? formatDateToText(selectedApplicant.endDate) : '' }}
                            </p>
                        </div>
                    </div>

                    <!-- Attendance Table -->
                    <div class="overflow-x-auto border border-purple-300 rounded">
                        <table class="min-w-full dark:bg-gray-800 text-xs md:text-sm">
                            <thead>
                                <tr class="bg-gray-500 text-white">
                                    <th class="border border-gray-300 px-2 md:px-4 py-2 text-center">DATE</th>
                                    <th class="border border-gray-300 px-2 md:px-4 py-2 text-center">REMARKS</th>
                                    <th class="border border-gray-300 px-2 md:px-4 py-2 text-center">NOTES</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(attendance, index) in dynamicAttendanceRows" :key="index">
                                    <td class="border border-gray-300 px-2 md:px-4 py-2 text-center">{{ attendance.date }}</td>
                                    <td
                                        :class="[
                                            'border border-gray-300 px-2 md:px-4 py-2 text-center',
                                            attendance.remarks === 'Present' ? 'bg-yellow-100' :
                                            attendance.remarks === 'With Late' ? 'bg-purple-400' :
                                            attendance.remarks === 'Absent' ? 'bg-pink-200' :
                                            attendance.remarks === 'Half Day' ? 'bg-blue-400' :
                                            attendance.remarks === 'Undertime' ? 'bg-red-400' : 'bg-white'
                                        ]"
                                    >
                                        {{ attendance.remarks }}
                                    </td>
                                    <td class="border border-gray-300 px-2 md:px-4 py-2 text-center">{{ attendance.notes || '--' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- right side -->
                <div class="rounded-lg p-4 md:p-6 w-full lg:w-1/2 max-w-3xl space-y-8">
                    <!-- First Payout -->
                    <div v-if="getTrainingDays(selectedApplicant.trainingDuration) >= 10">
                        <h2 class="text-lg font-bold text-purple-700 mb-1">First Payout</h2>

                        <div class="w-full border border-purple-300 p-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <label class="font-semibold sm:w-48">Allowed Released Date:</label>
                            <input
                                type="date"
                                class="flex-1 p-2 border rounded-md focus:ring focus:ring-purple-200 focus:border-purple-400 border-purple-300"
                            />
                        </div>

                        <div class="w-full border border-purple-300 p-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <label class="font-semibold sm:w-48">Remarks:</label>
                            <div class="flex flex-col sm:flex-row gap-2 flex-1">
                                <select
                                class="flex-1 p-2 border border-purple-300 rounded-md focus:ring focus:ring-purple-200 focus:border-purple-400"
                                >
                                        <option value="">Select Month</option>
                                        <option value="January">January</option>
                                        <option value="February">February</option>
                                        <option value="March">March</option>
                                        <option value="April">April</option>
                                        <option value="May">May</option>
                                        <option value="June">June</option>
                                        <option value="July">July</option>
                                        <option value="August">August</option>
                                        <option value="September">September</option>
                                        <option value="October">October</option>
                                        <option value="November">November</option>
                                        <option value="December">December</option>
                                </select>
                                <input
                                type="text"
                                placeholder="0-0 (0-Days)"
                                class="w-full sm:w-40 p-2 border border-purple-300 rounded-md focus:ring focus:ring-purple-200 focus:border-purple-400"
                                />
                            </div>
                        </div>

                        <div class="w-full border border-purple-300 p-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <label class="font-semibold sm:w-48">Status:</label>
                            <select
                                class="flex-1 p-2 border border-purple-300 rounded-md focus:ring focus:ring-purple-200 focus:border-purple-400"
                            >
                                <option value="">Select Status</option>
                                <option value="Completed">Completed</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                    </div>

                    <!-- Final Payout -->
                    <div>
                        <h2 class="text-lg font-bold text-purple-700 mb-1">Final Payout</h2>

                        <div class="w-full border border-purple-300 p-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <label class="font-semibold sm:w-48">Allowed Released Date:</label>
                            <input
                                type="date"
                                class="flex-1 p-2 border border-purple-300 rounded-md focus:ring focus:ring-purple-200 focus:border-purple-400"
                            />
                        </div>

                        <div class="w-full border border-purple-300 p-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <label class="font-semibold sm:w-48">Remarks:</label>
                            <div class="flex flex-col sm:flex-row gap-2 flex-1">
                                <select
                                class="flex-1 p-2 border border-purple-300 rounded-md focus:ring focus:ring-purple-200 focus:border-purple-400"
                                >
                                        <option value="">Select Month</option>
                                        <option value="January">January</option>
                                        <option value="February">February</option>
                                        <option value="March">March</option>
                                        <option value="April">April</option>
                                        <option value="May">May</option>
                                        <option value="June">June</option>
                                        <option value="July">July</option>
                                        <option value="August">August</option>
                                        <option value="September">September</option>
                                        <option value="October">October</option>
                                        <option value="November">November</option>
                                        <option value="December">December</option>
                                </select>
                                <input
                                type="text"
                                placeholder="0-0 (0-Days)"
                                class="w-full sm:w-40 p-2 border border-purple-300 rounded-md focus:ring focus:ring-purple-200 focus:border-purple-400"
                                />
                            </div>
                        </div>

                        <div class="w-full border border-purple-300 p-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <label class="font-semibold sm:w-48">Status:</label>
                            <select
                                class="flex-1 p-2 border border-purple-300 rounded-md focus:ring focus:ring-purple-200 focus:border-purple-400"
                            >
                                <option value="">Select Status</option>
                                <option value="Completed">Completed</option>
                                <option value="Pending">Pending</option>
                            </select>
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
import { useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import ChevronLeftIcon from '@heroicons/vue/24/outline/ChevronLeftIcon.js'
import ChevronRightIcon from '@heroicons/vue/24/outline/ChevronRightIcon.js'

const router = useRouter()
const currentTraineeIndex = ref(0)
const currentTrainee = computed<Trainee | null>(() => {
    return applicants.value[currentTraineeIndex.value] || null
})

interface Trainee {
    name: string;
    position: string;
    team: string;
    office: string;
    startingDate: string;
    status?: string;
    endDate?: string;
    trainingStatus?: string;
    allowanceReleasedDate?: string;
    statusType?: string;
    trainingDuration?: string;
    attendance?: Array<{
        date: string;
        remarks: string;
        notes: string;
        status: string;
    }>;
    overallRemarks?: string;
}

const applicants = ref<Trainee[]>([
    {
        name: 'Benjamin Lucas Carter',
        position: 'SMM Specialist',
        team: 'SEO',
        office: 'Keppel',
        startingDate: '2025-08-07', // Thu
        endDate: '2025-08-27',      // Wed → covers exactly 15 weekdays
        trainingStatus: 'On going',
        allowanceReleasedDate: '',
        trainingDuration: '15 Days Pre-Employment Training',
        attendance: generateRandomAttendance(15, '2025-08-07'),
        overallRemarks: ''
    },
    {
        name: 'Christopher Daniel Evans',
        position: 'Business Development Associate',
        team: 'Brand Development Team',
        office: 'Keppel',
        startingDate: '2024-08-07', // Wed
        endDate: '2024-08-13',      // Tue → covers exactly 5 weekdays
        trainingStatus: 'On going',
        allowanceReleasedDate: '',
        trainingDuration: '5 Days Pre-Employment Training',
        attendance: generateRandomAttendance(5, '2024-08-07'),
        overallRemarks: ''
    },
    {
        name: 'Holabells',
        position: 'Graphic Designer',
        team: 'Design and Video Production',
        office: 'Keppel',
        startingDate: '2024-08-09', // Fri
        endDate: '2024-09-09',      // Mon → covers exactly 20 weekdays
        trainingStatus: 'On going',
        allowanceReleasedDate: '',
        trainingDuration: '20 Days Pre-Employment Training',
        attendance: generateRandomAttendance(20, '2024-08-09'),
        overallRemarks: ''
    },
    {
        name: 'Akizkiz',
        position: 'Front End Developer',
        team: 'Form Development',
        office: 'Keppel',
        startingDate: '2024-08-12', // Mon
        endDate: '2024-08-13',      // Tue → covers exactly 2 weekdays
        trainingStatus: 'On going',
        allowanceReleasedDate: '',
        trainingDuration: '2 Days Pre-Employment Training',
        attendance: generateRandomAttendance(2, '2024-08-12'),
        overallRemarks: ''
    },
])

function generateAttendanceRows(startDate: string, endDate: string) {
    const rows = [];
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    let currentDate = new Date(startDateObj);

    while (currentDate <= endDateObj) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            const dateStr = currentDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            rows.push({
                date: dateStr,
                remarks: 'Absent',
                notes: '--',
                status: ''
            });
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return rows;
}


function generateRandomAttendance(duration: number, startDate: string) {
    const remarksOptions = ['Absent', 'Present', 'With Late', 'Half Day', 'Undertime']
    const notesOptions = [
        '', // empty
        'Family emergency',
        'Sick leave',
        'Doctor appointment',
        'Traffic delay',
        'Personal errand',
        'Late due to commute'
    ]

    const rows = []
    let currentDate = new Date(startDate)

    for (let i = 0; i < duration; i++) {
        const remark = remarksOptions[Math.floor(Math.random() * remarksOptions.length)]
        const note = notesOptions[Math.floor(Math.random() * notesOptions.length)]
        rows.push({
            date: currentDate.toISOString().split('T')[0],
            remarks: remark,
            notes: note,
            status: ''
        })
        currentDate.setDate(currentDate.getDate() + 1)
    }
    return rows
}

const dynamicAttendanceRows = ref<Array<{
    date: string;
    remarks: string;
    notes: string;
    status: string;
}>>([])

function updateDynamicAttendanceRows() {
    if (currentTrainee.value?.startingDate && currentTrainee.value?.endDate) {
        dynamicAttendanceRows.value = generateAttendanceRows(
            currentTrainee.value.startingDate,
            currentTrainee.value.endDate
        )
    } else {
        dynamicAttendanceRows.value = currentTrainee.value?.attendance || []
    }
}

watch(currentTrainee, updateDynamicAttendanceRows, { immediate: true })

function getTrainingDays(duration: string | undefined): number {
  if (!duration) return 0;
  const match = duration.match(/^(\d+)/); // Grab leading number
  return match ? parseInt(match[1], 10) : 0;
}

const selectedApplicant = computed(() => {
    return applicants.value[currentTraineeIndex.value]
})

function nextTrainee() {
    if (currentTraineeIndex.value < applicants.value.length - 1) {
        currentTraineeIndex.value++
    }
}

function previousTrainee() {
    if (currentTraineeIndex.value > 0) {
        currentTraineeIndex.value--
    }
}

function formatDateToText(dateStr: string) {
    const date = new Date(dateStr)
    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }
    return date.toLocaleDateString('en-US', options)
}

function goBack() {
    router.push('/in-progress')
}
</script> 
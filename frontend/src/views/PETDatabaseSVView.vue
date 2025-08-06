<template>
    <div class="py-4">
        <!-- Tabs -->
        <div class="flex flex-wrap gap-2 md:gap-0 md:flex-nowrap">
            <button
                v-for="tab in tabs"
                :key="tab.key"
                @click="activeTab = tab.key"
                :class="[
                    'w-full md:w-auto px-4 md:px-6 py-2 font-semibold border-t border-l border-b-0 border-r-0',
                    activeTab === tab.key
                        ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white border-purple-400'
                        : 'bg-white dark:bg-gray-400 text-purple-700 border-purple-300 hover:bg-purple-50',
                    'transition-colors duration-150',
                ]"
                style="border-width: 2px 2px 2px 2px; margin-right: -2px;"
            >
                {{ tab.label }}
            </button>
        </div>
        <div
        :class="[
            activeTab !== 'ongoing' ? 'bg-white shadow p-6 dark:bg-gray-800' : '', 
            'rounded-b rounded-r'
        ]">
            <!-- Pending Tab Content -->
            <div v-if="activeTab === 'pending'">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                    <div class="text-lg font-semibold mb-2 md:mb-0 dark:text-white">Pending</div>
                    <div class="flex items-center gap-2">
                        <!-- Main Filter Dropdown -->
                        <select v-model="activeFilter" class="input input-bordered input-sm w-40">
                            <option value="name">Name</option>
                            <option value="position">Position</option>
                            <option value="team">Team</option>
                            <option value="office">Office Assigned</option>
                            <option value="startDate">Starting Date</option>
                        </select>
                        <!-- Adaptive Search -->
                        <template v-if="activeFilter === 'name'">
                            <input v-model="searchValue" type="text" placeholder="Search name..." class="input input-bordered input-sm w-58" />
                        </template>
                        <template v-else-if="activeFilter === 'position'">
                            <select v-model="searchValue" class="input input-bordered input-sm w-48">
                                <option value="">All Positions</option>
                                <option v-for="pos in uniquePositions" :key="pos" :value="pos">{{ pos }}</option>
                            </select>
                        </template>
                        <template v-else-if="activeFilter === 'team'">
                            <select v-model="searchValue" class="input input-bordered input-sm w-48">
                                <option value="">All Teams</option>
                                <option v-for="team in uniqueTeams" :key="team" :value="team">{{ team }}</option>
                            </select>
                        </template>
                        <template v-else-if="activeFilter === 'office'">
                            <select v-model="searchValue" class="input input-bordered input-sm w-36">
                                <option value="">All Offices</option>
                                <option value="Keppel">Keppel</option>
                                <option value="Talisay">Talisay</option>
                            </select>
                        </template>
                        <template v-else-if="activeFilter === 'startDate'">
                            From
                            <input v-model="dateFrom" type="date" class="input input-bordered input-sm w-46" placeholder="From" />
                            To
                            <input v-model="dateTo" type="date" class="input input-bordered input-sm w-46" placeholder="To" />
                        </template>
                    </div>
                </div>
                <div class="overflow-x-auto border border-gray-100 bg-white">
                    <table class="min-w-full dark:bg-gray-800">
                        <thead>
                            <tr class="bg-purple-400 text-white text-xs">
                                <th class="px-2 py-2 text-center">No.</th>
                                <th class="px-4 py-2 font-semibold">Applicant</th>
                                <th class="px-4 py-2 font-semibold">Position</th>
                                <th class="px-4 py-2 font-semibold">Team</th>
                                <th class="px-4 py-2 font-semibold">Office Assigned</th>
                                <th class="px-4 py-2 font-semibold">Starting Date</th>
                                <th class="px-4 py-2 font-semibold">Requirement Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(trainee, i) in paginatedTrainees" :key="i" class="dark:hover:bg-gray-500 border-b border-gray-100 last:border-b-0">
                                <td class="px-2 py-2 text-center">{{ (currentPage-1)*pageSize + i + 1 }}</td>
                                <td class="px-4 py-2 text-xs text-indigo-700 underline cursor-pointer text-center">
                                    <router-link :to="{ name: 'applicant-dashboard-details', params: { id: i } }" class="text-indigo-700 underline dark:text-indigo-400">
                                        {{ trainee.name }}
                                    </router-link>
                                </td>
                                <td class="px-4 py-2 text-xs text-center">{{ trainee.position }}</td>
                                <td class="px-4 py-2 text-xs text-center">{{ trainee.team }}</td>
                                <td class="px-4 py-2 text-xs text-center">{{ trainee.office }}</td>
                                <td class="px-4 py-2 text-xs text-center">{{ trainee.startingDate }}</td>
                                <td class="px-4 py-2 text-xs text-center">
                                    <select v-model="trainee.status" class="input input-bordered input-xs w-24">
                                        <option value="Pending">Pending</option>
                                        <option value="Proceed">Proceed</option>
                                        <option value="On-going">On-going</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </td>
                            </tr>
                            <tr v-if="paginatedTrainees.length === 0">
                                <td colspan="7" class="text-center text-gray-400 py-6">No trainees found.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- Pagination -->
                <div class="flex justify-end mt-4">
                    <nav class="inline-flex -space-x-px">
                        <button @click="prevPage" :disabled="currentPage === 1" class="px-2 py-1 text-xs text-gray-500 border border-gray-300 rounded-l hover:bg-purple-100 bg-white transition-colors dark:bg-gray-700">&lt;</button>
                        <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="['px-2 py-1 text-xs border border-gray-300', currentPage === page ? 'text-indigo-400 dark:bg-gray-600 bg-gray-600' : 'text-gray-500', '']">{{ page }}</button>
                        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-2 py-1 text-xs text-gray-500 border border-gray-300 rounded-r hover:bg-purple-100 bg-white transition-colors dark:bg-gray-700">&gt;</button>
                    </nav>
                </div>
            </div>

            <!-- On-going Tab Content -->
            <div v-if="activeTab === 'ongoing'">
                <!-- Trainee Information Section -->
                <div class="bg-white p-6 mb-6 shadow dark:bg-gray-800">
                    <div class="flex items-center">
                        <button 
                            v-if="currentTraineeIndex > 0"
                            @click="previousTrainee" 
                            class="btn btn-circle btn-sm bg-purple-500 text-white mr-4"
                        >
                            <ChevronLeftIcon class="h-4 w-4"/>
                        </button>
                        
                        <div class="">
                            <h2 class="text-2xl font-bold text-blue-600 underline dark:text-indigo-400">{{ currentTrainee.name }}</h2>
                            <p class="text-gray-600 mb-1 text-lg font-semibold dark:text-gray-300">{{ currentTrainee.position }}</p>
                            <p class="text-gray-600 mb-1 text-sm dark:text-gray-500">{{ currentTrainee.team }}</p>
                            <p class="text-gray-600 mb-1 text-sm dark:text-gray-500">{{ currentTrainee.trainingDuration }}</p>
                        </div>
                        
                        <button 
                            v-if="currentTraineeIndex < traineesData.ongoing.length - 1"
                            @click="nextTrainee" 
                            class="btn btn-circle btn-sm bg-purple-500 text-white ml-2"
                        >
                            <ChevronRightIcon class="h-4 w-4"/>
                        </button>
                    </div>
                </div>

                <!-- Attendance Sheet Section -->
                <div class="flex justify-center bg-white shadow dark:bg-gray-800">
                    <div class="rounded p-4 md:p-6 w-full max-w-6xl">
                        <h3 class="text-lg font-bold text-center mb-4">Attendance Sheet</h3>
                        
                        <!-- Date Range -->
                        <div class="flex flex-col md:flex-row mb-6 text-center">
                            <div class="w-full md:w-1/2 border border-purple-300 px-2 md:px-4 py-3 md:py-6 mb-2 md:mb-0">
                                <h1 class="font-semibold text-lg md:text-2xl">Starting Date</h1>
                                <p class="text-sm md:text-base">{{ currentTrainee.startingDate ? formatDateToText(currentTrainee.startingDate) : '' }}</p>
                            </div>
                            <div class="w-full md:w-1/2 border border-purple-300 px-2 md:px-4 py-3 md:py-6">
                                <h1 class="font-semibold text-lg md:text-2xl">End Date</h1>
                                <p class="text-sm md:text-base">{{ currentTrainee.endDate ? formatDateToText(currentTrainee.endDate) : '' }}</p>
                            </div>
                        </div>

                        <!-- Add New Row Button -->
                        <!-- <div class="text-right mb-4">
                            <button @click="addAttendanceRow" class="btn btn-sm bg-purple-500 text-white hover:bg-purple-600">
                                <PlusIcon class="h-4 w-4 mr-1 text-white"/>
                                Add New Row
                            </button>
                        </div> -->

                        <!-- Attendance Table and Remarks -->
                        <div class="flex flex-col lg:flex-row gap-4">
                            <!-- Attendance Table -->
                            <div class="flex-1">
                                <div class="overflow-x-auto border border-gray-300 rounded" style="max-height: 400px; overflow-y: auto;">
                                    <table class="min-w-full dark:bg-gray-800">
                                        <thead class="">
                                            <tr class="bg-gray-500 text-white text-xs">
                                                <th class="border border-gray-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm">DATE</th>
                                                <th class="border border-gray-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm">REMARKS</th>
                                                <th class="border border-gray-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm">NOTES</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(attendance, index) in dynamicAttendanceRows" :key="index">
                                                <td class="border border-gray-300 px-2 md:px-4 py-2 text-center">
                                                    <input 
                                                        v-model="attendance.date" 
                                                        type="date" 
                                                        class="w-full text-center border-none focus:outline-none text-xs md:text-sm dark:bg-gray-800"
                                                    />
                                                </td>
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
                                                    <select
                                                        v-model="attendance.remarks"
                                                        class="w-full text-center bg-transparent border-none focus:outline-none text-xs md:text-sm dark:text-black"
                                                        :class="[
                                                            'border border-gray-300 px-2 md:px-4 py-2 text-center',
                                                            attendance.remarks === 'Present' ? 'dark:bg-yellow-100' :
                                                            attendance.remarks === 'With Late' ? 'dark:bg-purple-400' :
                                                            attendance.remarks === 'Absent' ? 'dark:bg-pink-200' :
                                                            attendance.remarks === 'Half Day' ? 'dark:bg-blue-400' :
                                                            attendance.remarks === 'Undertime' ? 'dark:bg-red-400' : 'bg-white'
                                                        ]"
                                                    >
                                                        <option value="Absent">Absent</option>
                                                        <option value="Present">Present</option>
                                                        <option value="With Late">With Late</option>
                                                        <option value="Half Day">Half Day</option>
                                                        <option value="Undertime">Undertime</option>
                                                    </select>
                                                </td>
                                                <!-- Different input types based on remarks -->
                                                <td class="border border-gray-300 px-2 md:px-4 py-2 text-center">
                                                    <div v-if="attendance.remarks === 'Present'">
                                                        <span class="text-gray-500 text-xs md:text-sm dark:bg-gray-800 dark:text-white">--</span>
                                                    </div>
                                                    <div v-else-if="attendance.remarks === 'Absent'">
                                                        <input 
                                                            v-model="attendance.notes" 
                                                            type="text" 
                                                            class="w-full text-center border-none focus:outline-none text-xs md:text-sm dark:bg-gray-800 dark:text-white"
                                                            placeholder="Reason for absence" 
                                                        />
                                                    </div>
                                                    <div v-else-if="attendance.remarks === 'With Late'">
                                                        <input 
                                                            v-model="attendance.notes" 
                                                            type="time" 
                                                            class="w-full text-center border-none focus:outline-none text-xs md:text-sm dark:bg-gray-800 dark:text-white" 
                                                        />
                                                    </div>
                                                    <div v-else-if="attendance.remarks === 'Half Day'">
                                                        <div class="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                                                            <span class="text-xs md:text-sm text-gray-600 dark:text-white">12:00 PM</span>
                                                            <input 
                                                                v-model="attendance.notes" 
                                                                type="text" 
                                                                class="flex-1 text-center border-none focus:outline-none text-xs md:text-sm dark:bg-gray-800 dark:text-white" 
                                                                placeholder="Reason" 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div v-else-if="attendance.remarks === 'Undertime'">
                                                        <div class="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                                                            <span class="text-xs md:text-sm text-gray-600 dark:bg-gray-800 dark:text-white">12:00 PM</span>
                                                            <input 
                                                                v-model="attendance.notes" 
                                                                type="text" 
                                                                class="flex-1 text-center border-none focus:outline-none text-xs md:text-sm dark:bg-gray-800 dark:text-white" 
                                                                placeholder="Reason" 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div v-else>
                                                        <input 
                                                            v-model="attendance.notes" 
                                                            type="text" 
                                                            class="w-full text-center border-none focus:outline-none text-xs md:text-sm dark:bg-gray-800" 
                                                            placeholder="SV can edit here" 
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <!-- Remarks Section -->
                            <div class="w-full lg:w-64 rounded">
                                <table class="min-w-full dark:bg-gray-800">
                                    <thead>
                                        <tr class="bg-gray-500 text-white text-xs">
                                            <th class="border border-gray-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="border border-gray-300 px-2 md:px-4 py-2 text-center">
                                                <select v-model="currentTrainee.overallRemarks" class="w-full text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-purple-500 text-xs md:text-sm">
                                                    <option value="">Select remarks</option>
                                                    <option value="For Job Offer">For Job Offer</option>
                                                    <option value="Failed">Failed</option>
                                                </select>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Completed Training Tab Content -->
            <div v-if="activeTab === 'completed'">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                    <div class="text-lg font-semibold mb-2 md:mb-0 dark:text-white">Completed Training</div>
                    <div class="flex items-center gap-2">
                        <!-- Main Filter Dropdown -->
                        <select v-model="activeFilter" class="input input-bordered input-sm w-40">
                            <option value="name">Name</option>
                            <option value="position">Position</option>
                            <option value="team">Team</option>
                            <option value="office">Office Assigned</option>
                            <option value="startDate">Starting Date</option>
                        </select>
                        <!-- Adaptive Search -->
                        <template v-if="activeFilter === 'name'">
                            <input v-model="searchValue" type="text" placeholder="Search name..." class="input input-bordered input-sm w-58" />
                        </template>
                        <template v-else-if="activeFilter === 'position'">
                            <select v-model="searchValue" class="input input-bordered input-sm w-48">
                                <option value="">All Positions</option>
                                <option v-for="pos in uniquePositions" :key="pos" :value="pos">{{ pos }}</option>
                            </select>
                        </template>
                        <template v-else-if="activeFilter === 'team'">
                            <select v-model="searchValue" class="input input-bordered input-sm w-48">
                                <option value="">All Teams</option>
                                <option v-for="team in uniqueTeams" :key="team" :value="team">{{ team }}</option>
                            </select>
                        </template>
                        <template v-else-if="activeFilter === 'office'">
                            <select v-model="searchValue" class="input input-bordered input-sm w-36">
                                <option value="">All Offices</option>
                                <option value="Keppel">Keppel</option>
                                <option value="Talisay">Talisay</option>
                            </select>
                        </template>
                        <template v-else-if="activeFilter === 'startDate'">
                            From
                            <input v-model="dateFrom" type="date" class="input input-bordered input-sm w-46" placeholder="From" />
                            To
                            <input v-model="dateTo" type="date" class="input input-bordered input-sm w-46" placeholder="To" />
                        </template>
                    </div>
                </div>

                <!-- Completed Training Sub-Tabs -->
                <div class="flex mb-2 gap-2">
                    <button
                        v-for="subTab in completedSubTabs"
                        :key="subTab.key"
                        @click="activeCompletedSubTab = subTab.key"
                        :class="[
                            'px-4 py-1 rounded font-semibold text-xs',
                            activeCompletedSubTab === subTab.key
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-purple-100',
                        ]"
                    >
                        {{ subTab.label }}
                    </button>
                </div>

                <div class="overflow-x-auto border border-gray-100 bg-white">
                    <table class="min-w-full dark:bg-gray-800">
                        <thead>
                            <tr class="bg-purple-400 text-white text-xs">
                                <th class="px-2 py-2 text-center">No.</th>
                                <th class="px-4 py-2 font-semibold">Applicant</th>
                                <th class="px-4 py-2 font-semibold">Position</th>
                                <th class="px-4 py-2 font-semibold">Team</th>
                                <th class="px-4 py-2 font-semibold">Office Assigned</th>
                                <th class="px-4 py-2 font-semibold">Starting Date</th>
                                <th class="px-4 py-2 font-semibold">End Date</th>
                                <th class="px-4 py-2 font-semibold">Training Status</th>
                                <th class="px-4 py-2 font-semibold">Allowance Released Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(trainee, i) in paginatedCompletedTrainees" :key="i"
                                :class="[
                                    trainee.statusType === 'passed' ? 'bg-green-100 text-green-900' :
                                    trainee.statusType === 'failed' ? 'bg-red-100 text-red-900' :
                                    trainee.statusType === 'no-show' ? 'bg-gray-200 text-gray-700' :
                                    trainee.statusType === 'withdrawn' ? 'bg-black text-white' : '',
                                    'dark:hover:bg-gray-500 border-b border-gray-100 last:border-b-0'
                                ]"
                            >
                                <td class="px-2 py-2 text-center">{{ (currentPage-1)*pageSize + i + 1 }}</td>
                                <td class="px-4 py-2 text-xs text-indigo-700 underline cursor-pointer text-center dark:text-indigo-400">
                                    <router-link :to="{ name: 'applicant-dashboard-details', params: { id: i } }" class="text-indigo-700 underline dark:text-indigo-400">
                                        {{ trainee.name }}
                                    </router-link>
                                </td>
                                <td class="px-4 py-2 text-xs text-center">{{ trainee.position }}</td>
                                <td class="px-4 py-2 text-xs text-center">{{ trainee.team }}</td>
                                <td class="px-4 py-2 text-xs text-center">{{ trainee.office }}</td>
                                <td class="px-4 py-2 text-xs text-center">{{ trainee.startingDate }}</td>
                                <td class="px-4 py-2 text-xs text-center">{{ trainee.endDate || '-' }}</td>
                                <td class="px-4 py-2 text-xs text-center">{{ trainee.trainingStatus || trainee.status || '-' }}</td>
                                <td class="px-4 py-2 text-xs text-center">{{ trainee.allowanceReleasedDate || '-' }}</td>
                            </tr>
                            <tr v-if="paginatedCompletedTrainees.length === 0">
                                <td colspan="9" class="text-center text-gray-400 py-6">No trainees found.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- Pagination -->
                <div class="flex justify-end mt-4">
                    <nav class="inline-flex -space-x-px">
                        <button @click="prevPage" :disabled="currentPage === 1" class="px-2 py-1 text-xs text-gray-500 border border-gray-300 rounded-l hover:bg-purple-100 bg-white transition-colors dark:bg-gray-700">&lt;</button>
                        <button v-for="page in completedTotalPages" :key="page" @click="goToPage(page)" :class="['px-2 py-1 text-xs border border-gray-300', currentPage === page ? 'text-indigo-400 dark:bg-gray-600 bg-gray-600' : 'text-gray-500', '']">{{ page }}</button>
                        <button @click="nextPage" :disabled="currentPage === completedTotalPages" class="px-2 py-1 text-xs text-gray-500 border border-gray-300 rounded-r hover:bg-purple-100 bg-white transition-colors dark:bg-gray-700">&gt;</button>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ChevronLeftIcon from '@heroicons/vue/24/outline/ChevronLeftIcon.js'
import ChevronRightIcon from '@heroicons/vue/24/outline/ChevronRightIcon.js'
import PlusIcon from '@heroicons/vue/24/outline/PlusIcon.js'

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
    overallRemarks?: string; // Added overallRemarks
}

interface Tab {
    key: 'pending' | 'ongoing' | 'completed';
    label: string;
}

const tabs: Tab[] = [
    { key: 'pending', label: 'Pending' },
    { key: 'ongoing', label: 'On-going' },
    { key: 'completed', label: 'Completed Training' },
]

const activeTab = ref<Tab['key']>('pending')
const activeFilter = ref('name')
const searchValue = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const pageSize = 10
const currentPage = ref(1)
const currentTraineeIndex = ref(0)

// Add sub-tabs for Completed Training
const completedSubTabs = [
    { key: 'all', label: 'All' },
    { key: 'passed', label: 'Passed' },
    { key: 'failed', label: 'Failed' },
    { key: 'no-show', label: 'No Show' },
    { key: 'withdrawn', label: 'Withdrawn' },
]
const activeCompletedSubTab = ref('all')

const traineesData: Record<Tab['key'], Trainee[]> = {
    pending: [
        { name: 'Olivia Brooks', position: 'SMM Specialist', team: 'Digital Marketing Team', office: 'Keppel', startingDate: 'August 5, 2024', status: 'Pending' },
        { name: 'Heather Green', position: 'Business Development Associate', team: 'Brand Development Team', office: 'Talisay', startingDate: 'August 9, 2024', status: 'Pending' },
        { name: 'Samantha Turner', position: 'Graphic Designer', team: 'Design', office: 'Keppel', startingDate: 'August 12, 2024', status: 'Pending' },
        { name: 'Samuel Harris', position: 'Front-end Developer', team: 'Web Development', office: 'Keppel', startingDate: 'August 12, 2024', status: 'Pending' },
        { name: 'Elizabeth Anderson', position: 'Business Development Associate', team: 'Brand Development Team', office: 'Talisay', startingDate: 'August 12, 2024', status: 'Pending' },
    ],
    ongoing: [
        { 
            name: 'Benjamin Lucas Carter', 
            position: 'Web Developer', 
            team: 'Form Developers Group', 
            office: 'Keppel', 
            startingDate: '2025-08-07', 
            endDate: '2025-08-13', 
            trainingStatus: 'On going', 
            allowanceReleasedDate: '',
            trainingDuration: '12 Days Pre-Employment Training',
            attendance: [],
            overallRemarks: ''
        },
        {
            name: 'Christopher Daniel Evans', 
            position: 'Web Developer', 
            team: 'Form Developers Group', 
            office: 'Keppel', 
            startingDate: '2024-08-07', 
            endDate: '2024-08-12', 
            trainingStatus: 'On going', 
            allowanceReleasedDate: '',
            trainingDuration: '12 Days Pre-Employment Training',
            attendance: [],
            overallRemarks: ''
        },
        {
            name: 'Holabells', 
            position: 'Web Developer', 
            team: 'Form Developers Group', 
            office: 'Keppel', 
            startingDate: '2024-08-09', 
            endDate: '2024-08-14', 
            trainingStatus: 'On going', 
            allowanceReleasedDate: '',
            trainingDuration: '12 Days Pre-Employment Training',
            attendance: [],
            overallRemarks: ''
        },
        {
            name: 'Akizkiz', 
            position: 'Web Developer', 
            team: 'Form Developers Group', 
            office: 'Keppel', 
            startingDate: '2024-08-12', 
            endDate: '2024-08-16', 
            trainingStatus: 'On going', 
            allowanceReleasedDate: '',
            trainingDuration: '12 Days Pre-Employment Training',
            attendance: [],
            overallRemarks: ''
        },
    ],
    completed: [
        {
            name: 'Olivia Brooks',
            position: 'SMM Specialist',
            team: 'Digital Marketing Team',
            office: 'Keppel',
            startingDate: 'August 5, 2024',
            endDate: 'August 6, 2024',
            trainingStatus: 'For JO',
            allowanceReleasedDate: 'August 6, 2024',
            statusType: 'passed',
            overallRemarks: 'Good performance' // Added overallRemarks
        },
        {
            name: 'Heather Green',
            position: 'Business Development Associate',
            team: 'Brand Development Team',
            office: 'Keppel',
            startingDate: 'August 9, 2024',
            endDate: 'August 11, 2024',
            trainingStatus: 'For JO',
            allowanceReleasedDate: 'August 11, 2024',
            statusType: 'passed',
            overallRemarks: 'Excellent communication skills' // Added overallRemarks
        },
        {
            name: 'Samantha Turner',
            position: 'Graphic Designer',
            team: 'Design',
            office: 'Keppel',
            startingDate: 'August 12, 2024',
            endDate: 'August 14, 2024',
            trainingStatus: 'Failed',
            allowanceReleasedDate: 'August 14, 2024',
            statusType: 'failed',
            overallRemarks: 'Needs improvement in technical skills' // Added overallRemarks
        },
        {
            name: 'Elizabeth Anderson',
            position: 'Business Development Associate',
            team: 'Brand Development Team',
            office: 'Keppel',
            startingDate: 'August 12, 2024',
            endDate: 'August 17, 2024',
            trainingStatus: 'No Show',
            allowanceReleasedDate: '',
            statusType: 'no-show',
            overallRemarks: 'Communication issue' // Added overallRemarks
        },
        {
            name: 'Samuel Harris',
            position: 'Front-end Developer',
            team: 'Web Development',
            office: 'Keppel',
            startingDate: 'August 12, 2024',
            endDate: 'September 6, 2024',
            trainingStatus: 'Withdrawn',
            allowanceReleasedDate: '',
            statusType: 'withdrawn',
            overallRemarks: 'Personal reasons' // Added overallRemarks
        },
    ],
}

const trainees = computed<Trainee[]>(() => traineesData[activeTab.value])
const uniquePositions = computed(() => [...new Set(trainees.value.map((t: Trainee) => t.position))])
const uniqueTeams = computed(() => [...new Set(trainees.value.map((t: Trainee) => t.team))])

const filteredTrainees = computed<Trainee[]>(() => {
    if (activeFilter.value === 'name') {
        return trainees.value.filter((t: Trainee) => !searchValue.value || t.name.toLowerCase().includes(searchValue.value.toLowerCase()))
    } else if (activeFilter.value === 'position') {
        return trainees.value.filter((t: Trainee) => !searchValue.value || t.position === searchValue.value)
    } else if (activeFilter.value === 'team') {
        return trainees.value.filter((t: Trainee) => !searchValue.value || t.team === searchValue.value)
    } else if (activeFilter.value === 'office') {
        return trainees.value.filter((t: Trainee) => !searchValue.value || t.office === searchValue.value)
    } else if (activeFilter.value === 'startDate') {
        return trainees.value.filter((t: Trainee) => {
            if (dateFrom.value && t.startingDate < dateFrom.value) return false
            if (dateTo.value && t.startingDate > dateTo.value) return false
            return true
        })
    }
    return trainees.value
})

// Filter for completed sub-tabs
const filteredCompletedTrainees = computed(() => {
    if (activeCompletedSubTab.value === 'all') return traineesData.completed
    return traineesData.completed.filter(t => t.statusType === activeCompletedSubTab.value)
})

// For completed trainees, filter by sub-tab, then by search/filter
const filteredAndSearchedCompletedTrainees = computed(() => {
    let list = filteredCompletedTrainees.value
    // Apply search and filter
    if (activeFilter.value === 'name') {
        list = list.filter((t) => !searchValue.value || t.name.toLowerCase().includes(searchValue.value.toLowerCase()))
    } else if (activeFilter.value === 'position') {
        list = list.filter((t) => !searchValue.value || t.position === searchValue.value)
    } else if (activeFilter.value === 'team') {
        list = list.filter((t) => !searchValue.value || t.team === searchValue.value)
    } else if (activeFilter.value === 'office') {
        list = list.filter((t) => !searchValue.value || t.office === searchValue.value)
    } else if (activeFilter.value === 'startDate') {
        list = list.filter((t) => {
            if (dateFrom.value && t.startingDate < dateFrom.value) return false
            if (dateTo.value && t.startingDate > dateTo.value) return false
            return true
        })
    }
    return list
})

const completedTotalPages = computed(() => Math.ceil(filteredAndSearchedCompletedTrainees.value.length / pageSize))
const paginatedCompletedTrainees = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredAndSearchedCompletedTrainees.value.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.ceil(filteredTrainees.value.length / pageSize))
const paginatedTrainees = computed<Trainee[]>(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredTrainees.value.slice(start, start + pageSize)
})

// Current trainee for ongoing tab
const currentTrainee = computed(() => traineesData.ongoing[currentTraineeIndex.value] || traineesData.ongoing[0])

// Function to format date to readable text
function formatDateToText(dateStr: string) {
    const date = new Date(dateStr)
    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }
    return date.toLocaleDateString('en-US', options)
}

// Function to generate attendance rows based on start and end dates
function generateAttendanceRows(startDate: string, endDate: string) {
    const rows = []
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    // Convert date strings to Date objects and handle different formats
    const parseDate = (dateStr: string) => {
        // Handle "August 5, 2024" format
        if (dateStr.includes(',')) {
            return new Date(dateStr)
        }
        // Handle "Aug 5, 24" format
        if (dateStr.includes('Aug')) {
            const parts = dateStr.split(', ')
            const day = parseInt(parts[0].split(' ')[1])
            const year = '20' + parts[1]
            return new Date(`${year}-08-${day.toString().padStart(2, '0')}`)
        }
        return new Date(dateStr)
    }
    
    const startDateObj = parseDate(startDate)
    const endDateObj = parseDate(endDate)
    
    let currentDate = new Date(startDateObj)
    
    while (currentDate <= endDateObj) {
        // Skip weekends (Saturday = 6, Sunday = 0)
        const dayOfWeek = currentDate.getDay()
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            const dateStr = currentDate.toISOString().split('T')[0] // YYYY-MM-DD format
            rows.push({
                date: dateStr,
                remarks: 'Absent',
                notes: '',
                status: ''
            })
        }
        currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return rows
}

// Computed property to get dynamic attendance rows
const dynamicAttendanceRows = ref<Array<{
    date: string;
    remarks: string;
    notes: string;
    status: string;
}>>([])

// Function to update dynamic attendance rows
function updateDynamicAttendanceRows() {
    if (currentTrainee.value && currentTrainee.value.startingDate && currentTrainee.value.endDate) {
        dynamicAttendanceRows.value = generateAttendanceRows(currentTrainee.value.startingDate, currentTrainee.value.endDate)
    } else {
        dynamicAttendanceRows.value = currentTrainee.value?.attendance || []
    }
}

// Watch for changes in current trainee to update dynamic rows
watch(currentTrainee, () => {
    updateDynamicAttendanceRows()
}, { immediate: true })

function goToPage(page: number) {
    currentPage.value = page
}
function prevPage() {
    if (currentPage.value > 1) currentPage.value--
}
function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++
}

function nextTrainee() {
    if (currentTraineeIndex.value < traineesData.ongoing.length - 1) {
        currentTraineeIndex.value++
    }
}

function previousTrainee() {
    if (currentTraineeIndex.value > 0) {
        currentTraineeIndex.value--
    }
}

function addAttendanceRow() {
    // For dynamic attendance, we can add a manual row
    // This will be added to the existing dynamic rows
    const today = new Date().toISOString().split('T')[0]
    const newRow = {
        date: today,
        remarks: 'Absent',
        notes: '',
        status: ''
    }
    
    // If we have dynamic rows, add to them
    if (currentTrainee.value && dynamicAttendanceRows.value.length > 0) {
        // Add to the dynamic rows array
        dynamicAttendanceRows.value.push(newRow)
    } else if (currentTrainee.value && currentTrainee.value.attendance) {
        // Fallback to original attendance array
        currentTrainee.value.attendance.push(newRow)
    }
}

watch(activeTab, () => {
    currentPage.value = 1
    searchValue.value = ''
    activeFilter.value = 'name'
    dateFrom.value = ''
    dateTo.value = ''
    currentTraineeIndex.value = 0
})

watch(activeFilter, () => {
    searchValue.value = ''
    dateFrom.value = ''
    dateTo.value = ''
})
</script> 
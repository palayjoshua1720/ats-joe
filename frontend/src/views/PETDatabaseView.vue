<template>
    <div class="py-4">
        <!-- Tabs -->
        <div class="flex flex-wrap gap-2 md:gap-0 md:flex-nowrap">
            <button
                v-for="tab in tabs"
                :key="tab.key"
                @click="activeTab = tab.key"
                :class="[
                    'w-full md:w-auto px-4 md:px-6 py-2 font-semibold border-t border-l border-b-0 border-r-0 rounded-t',
                    activeTab === tab.key
                        ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white border-purple-400'
                        : 'bg-white text-purple-700 border-purple-300 hover:bg-purple-50',
                    'transition-colors duration-150',
                ]"
                style="border-width: 2px 2px 0 2px; margin-right: -2px;"
            >
                {{ tab.label }}
            </button>
        </div>
        <div class="bg-white rounded-b rounded-r shadow p-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div class="text-lg font-semibold mb-2 md:mb-0">{{ tabs.find((t: Tab) => t.key === activeTab)?.label }}</div>
                <div class="flex items-center gap-2">
                    <!-- Main Filter Dropdown -->
                    <select v-model="activeFilter" class="input input-bordered input-sm w-40">
                        <option value="name">Name</option>
                        <option value="position">Position</option>
                        <option value="team">Team</option>
                        <option value="office">Office Assigned</option>
                        <option value="startDate">Starting Date</option>
                        <option v-if="activeTab === 'ongoing'" value="endDate">End Date</option>
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
                    <template v-else-if="activeFilter === 'endDate'">
                        From
                        <input v-model="endDateFrom" type="date" class="input input-bordered input-sm w-46" placeholder="From" />
                        To
                        <input v-model="endDateTo" type="date" class="input input-bordered input-sm w-46" placeholder="To" />
                    </template>
                </div>
            </div>
            <!-- Completed Training Sub-Tabs (moved here) -->
            <div v-if="activeTab === 'completed'" class="flex mb-2 gap-2">
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
                <table class="min-w-full">
                    <thead>
                        <tr class="bg-purple-400 text-white text-xs">
                            <th class="px-2 py-2 text-center">No.</th>
                            <th class="px-4 py-2 font-semibold">Applicant</th>
                            <th class="px-4 py-2 font-semibold">Position</th>
                            <th class="px-4 py-2 font-semibold">Team</th>
                            <th class="px-4 py-2 font-semibold">Office Assigned</th>
                            <th class="px-4 py-2 font-semibold">Starting Date</th>
                            <th v-if="activeTab === 'ongoing' || activeTab === 'completed'" class="px-4 py-2 font-semibold">End Date</th>
                            <th v-if="activeTab === 'ongoing' || activeTab === 'completed'" class="px-4 py-2 font-semibold">Training Status</th>
                            <th v-if="activeTab === 'ongoing' || activeTab === 'completed'" class="px-4 py-2 font-semibold">Allowance Released Date</th>
                            <th v-if="activeTab === 'pending'" class="px-4 py-2 font-semibold">Requirement Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Completed Training Table -->
                        <template v-if="activeTab === 'completed'">
                            <tr v-for="(trainee, i) in paginatedCompletedTrainees" :key="i"
                                :class="[
                                    trainee.statusType === 'passed' ? 'bg-green-100 text-green-900' :
                                    trainee.statusType === 'failed' ? 'bg-red-100 text-red-900' :
                                    trainee.statusType === 'no-show' ? 'bg-gray-200 text-gray-700' :
                                    trainee.statusType === 'withdrawn' ? 'bg-black text-white' : '',
                                    'border-b border-gray-100 last:border-b-0'
                                ]">
                                <td class="px-2 py-2 text-center">{{ (currentPage-1)*pageSize + i + 1 }}</td>
                                <td class="px-4 py-2 text-xs text-indigo-700 underline cursor-pointer text-center">
                                    <router-link :to="{ name: 'applicant-dashboard-details', params: { id: i } }" class="text-indigo-700 underline">
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
                        </template>
                        <!-- Ongoing Table -->
                        <template v-else-if="activeTab === 'ongoing'">
                            <tr v-for="(trainee, i) in paginatedTrainees" :key="i" class="hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                                <td class="px-2 py-2 text-center">{{ (currentPage-1)*pageSize + i + 1 }}</td>
                                <td class="px-4 py-2 text-xs text-indigo-700 underline cursor-pointer text-center">
                                    <router-link :to="{ name: 'applicant-dashboard-details', params: { id: i } }" class="text-indigo-700 underline">
                                        {{ trainee.name }}
                                    </router-link>
                                </td>
                                <td class="px-4 py-2 text-xs text-center">{{ trainee.position }}</td>
                                <td class="px-4 py-2 text-xs text-center">{{ trainee.team }}</td>
                                <td class="px-4 py-2 text-xs text-center">{{ trainee.office }}</td>
                                <td class="px-4 py-2 text-xs text-center">{{ trainee.startingDate }}</td>
                                <td class="px-4 py-2 text-xs text-center">{{ trainee.endDate || '-' }}</td>
                                <td class="px-4 py-2 text-xs text-center">{{ trainee.trainingStatus || '-' }}</td>
                                <td class="px-4 py-2 text-xs text-center">{{ trainee.allowanceReleasedDate || '-' }}</td>
                            </tr>
                            <tr v-if="paginatedTrainees.length === 0">
                                <td colspan="9" class="text-center text-gray-400 py-6">No trainees found.</td>
                            </tr>
                        </template>
                        <!-- Pending Table -->
                        <template v-else>
                            <tr v-for="(trainee, i) in paginatedTrainees" :key="i" class="hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                                <td class="px-2 py-2 text-center">{{ (currentPage-1)*pageSize + i + 1 }}</td>
                                <td class="px-4 py-2 text-xs text-indigo-700 underline cursor-pointer text-center">
                                    <router-link :to="{ name: 'applicant-dashboard-details', params: { id: i } }" class="text-indigo-700 underline">
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
                        </template>
                    </tbody>
                </table>
            </div>
            <!-- Pagination -->
            <div class="flex justify-end mt-4">
                <nav class="inline-flex -space-x-px">
                    <button @click="prevPage" :disabled="currentPage === 1" class="px-2 py-1 text-xs text-gray-500 border border-gray-300 rounded-l hover:bg-purple-100 bg-white transition-colors">&lt;</button>
                    <button v-for="page in (activeTab === 'completed' ? completedTotalPages : totalPages)" :key="page" @click="goToPage(page)" :class="['px-2 py-1 text-xs border-t border-b border-gray-300', currentPage === page ? 'text-indigo-600' : 'text-gray-500', 'bg-white']">{{ page }}</button>
                    <button @click="nextPage" :disabled="currentPage === (activeTab === 'completed' ? completedTotalPages : totalPages)" class="px-2 py-1 text-xs text-gray-500 border border-gray-300 rounded-r hover:bg-purple-100 bg-white transition-colors">&gt;</button>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

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
    statusType?: string; // Added for completed trainees
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
const endDateFrom = ref('')
const endDateTo = ref('')
const pageSize = 5
const currentPage = ref(1)

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
        { name: 'Heather Green', position: 'Business Development Associate', team: 'Brand Development Team', office: 'Keppel', startingDate: 'August 9, 2024', status: 'Pending' },
        { name: 'Samantha Turner', position: 'Graphic Designer', team: 'Design', office: 'Keppel', startingDate: 'August 12, 2024', status: 'Pending' },
        { name: 'Samuel Harris', position: 'Front-end Developer', team: 'Web Development', office: 'Keppel', startingDate: 'August 12, 2024', status: 'Pending' },
        { name: 'Elizabeth Anderson', position: 'Business Development Associate', team: 'Brand Development Team', office: 'Keppel', startingDate: 'August 12, 2024', status: 'Pending' },
    ],
    ongoing: [
        { name: 'Olivia Brooks', position: 'SMM Specialist', team: 'Digital Marketing Team', office: 'Keppel', startingDate: 'August 5, 2024', endDate: 'August 6, 2024', trainingStatus: 'On going', allowanceReleasedDate: '', },
        { name: 'Heather Green', position: 'Business Development Associate', team: 'Brand Development Team', office: 'Keppel', startingDate: 'August 9, 2024', endDate: 'August 14, 2024', trainingStatus: 'For JO', allowanceReleasedDate: '', },
        { name: 'Samantha Turner', position: 'Graphic Designer', team: 'Design', office: 'Keppel', startingDate: 'August 12, 2024', endDate: 'August 14, 2024', trainingStatus: 'Failed', allowanceReleasedDate: '', },
        { name: 'Samuel Harris', position: 'Front-end Developer', team: 'Web Development', office: 'Keppel', startingDate: 'August 12, 2024', endDate: 'September 6, 2024', trainingStatus: 'Withdrawn', allowanceReleasedDate: 'September 2, 2024', },
        { name: 'Elizabeth Anderson', position: 'Business Development Associate', team: 'Brand Development Team', office: 'Keppel', startingDate: 'August 12, 2024', endDate: 'August 17, 2024', trainingStatus: 'No Show', allowanceReleasedDate: '', },
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
    } else if (activeFilter.value === 'endDate' && activeTab.value === 'ongoing') {
        return trainees.value.filter((t: Trainee) => {
            if (!t.endDate) return false
            if (endDateFrom.value && t.endDate < endDateFrom.value) return false
            if (endDateTo.value && t.endDate > endDateTo.value) return false
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
function goToPage(page: number) {
    currentPage.value = page
}
function prevPage() {
    if (currentPage.value > 1) currentPage.value--
}
function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++
}
watch(activeTab, () => {
    currentPage.value = 1
    searchValue.value = ''
    activeFilter.value = 'name'
    dateFrom.value = ''
    dateTo.value = ''
    endDateFrom.value = ''
    endDateTo.value = ''
})
watch(activeFilter, () => {
    searchValue.value = ''
    dateFrom.value = ''
    dateTo.value = ''
    endDateFrom.value = ''
    endDateTo.value = ''
})
</script>
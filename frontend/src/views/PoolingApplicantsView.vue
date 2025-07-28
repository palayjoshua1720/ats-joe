<template>
    <div class="py-4">
        <h1 class="text-2xl font-bold mb-12">Application Directory</h1>
        <!-- Modern Sub-tabs -->
        <div class="flex select-none relative z-0">
            <div
                v-for="tab in tabs"
                :key="tab.key"
                @click="goToTab(tab.key)"
                class="flex-1 cursor-pointer border border-purple-200 border-t-0 border-b-0 first:rounded-l last:rounded-r transition-all duration-200 dark:bg-gray-600"
                :class="[
                    isActiveTab(tab.key)
                        ? 'bg-white h-32 -translate-y-8 z-10'
                        : 'bg-white hover:bg-gray-50 h-24 hover:h-32 hover:-translate-y-8',
                    'flex flex-col items-center px-2',
                    'relative',
                ]"
                style="min-width: 90px;"
            >
                <div
                    :class="[
                        'absolute top-0 left-0 w-full h-2 rounded-t',
                        tab.color
                    ]"
                ></div>
                <div class="mt-4 text-3xl font-bold leading-none dark:text-white">{{ tab.count }}</div>
                <div class="text-xs font-semibold text-gray-700 mt-1 dark:text-white">{{ tab.label }}</div>
            </div>
        </div>

        <!-- Card Layout -->
        <div class="bg-white rounded shadow p-6 dark:bg-gray-800">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div class="text-lg font-semibold mb-2 md:mb-0"></div>
                <div class="flex items-center gap-2">
                    <!-- Main Filter Dropdown -->
                    <select v-model="activeFilter" class="input input-bordered input-sm w-36">
                        <option value="name">Name</option>
                        <option value="position">Position</option>
                        <option value="salary">Salary Range</option>
                        <option value="date">Date Applied</option>
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
                    <template v-else-if="activeFilter === 'salary'">
                        <select v-model="searchValue" class="input input-bordered input-sm w-48">
                            <option value="">All Salaries</option>
                            <option value="0-5000">₱0 - ₱5,000</option>
                            <option value="5001-10000">₱5,001 - ₱10,000</option>
                            <option value="10001-15000">₱10,001 - ₱15,000</option>
                            <option value="15001-20000">₱15,001 - ₱20,000</option>
                            <option value="20001-9999999">₱20,001+</option>
                        </select>
                    </template>
                    <template v-else-if="activeFilter === 'date'">
                        From
                        <input v-model="dateFrom" type="date" class="input input-bordered input-sm w-46" placeholder="From" />
                        To
                        <input v-model="dateTo" type="date" class="input input-bordered input-sm w-46" placeholder="To" />
                    </template>
                </div>
            </div>

            <!-- Modern Data Table -->
            <div class="overflow-x-auto border border-gray-100 bg-white">
                <table class="min-w-full dark:bg-gray-800">
                    <thead>
                        <tr class="bg-orange-500 text-white text-xs">
                            <th class="px-2 py-2 w-8 text-center">
                                <input type="checkbox" :checked="allSelected" @change="toggleAll" class="accent-indigo-500 rounded" />
                            </th>
                            <th class="px-4 py-2 font-semibold">Position</th>
                            <th class="px-4 py-2 font-semibold">Name</th>
                            <th class="px-4 py-2 font-semibold">Date Applied</th>
                            <th class="px-4 py-2 font-semibold">Email</th>
                            <th class="px-4 py-2 font-semibold">Contact Number</th>
                            <th class="px-4 py-2 font-semibold">Expected Salary</th>
                            <th class="px-4 py-2 font-semibold">Date Pending</th>
                            <th class="px-4 py-2 font-semibold">Floating Phase</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(applicant, i) in paginatedApplicants" :key="i" :class="[
                            'transition',
                            'hover:bg-gray-50',
                            'border-b border-gray-100 last:border-b-0 dark:hover:bg-gray-500'
                        ]">
                            <td class="px-2 py-2 text-center">
                                <input type="checkbox" v-model="selected" :value="i" class="accent-indigo-500 rounded" />
                            </td>
                            <td class="px-4 py-2 text-xs text-center">{{ applicant.position }}</td>
                            <td class="px-4 py-2 text-xs text-indigo-700 underline cursor-pointer text-center dark:text-indigo-400">{{ applicant.name }}</td>
                            <td class="px-4 py-2 text-xs text-center">{{ applicant.dateApplied }}</td>
                            <td class="px-4 py-2 text-xs text-center">{{ applicant.email }}</td>
                            <td class="px-4 py-2 text-xs text-center">{{ applicant.contact }}</td>
                            <td class="px-4 py-2 text-xs text-center">₱{{ applicant.salary }}</td>
                            <td class="px-4 py-2 text-xs text-center">{{ applicant.datePending }}</td>
                            <td class="px-4 py-2 text-xs text-center">{{ applicant.floatingPhase }}</td>
                        </tr>
                        <tr v-if="paginatedApplicants.length === 0">
                            <td colspan="9" class="text-center text-gray-400 py-6">No applicants found.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Color Legend and Pagination Inline -->
            <div class="flex items-center justify-between mt-4">
                <div class="bg-gray-100 p-3 rounded flex flex-col w-max dark:bg-gray-700">
                    <span class="mb-2"><b>Color Legend</b></span>
                    <div class="flex items-center">
                        <span class="w-4 h-4 rounded bg-orange-200 dark:bg-[#4B2C2A] mr-2"></span>
                        <span>Reapplicants</span>
                    </div>
                </div>
                <nav class="inline-flex -space-x-px dark:*:text-white">
                        <button
                            class="px-2 py-1 text-xs text-gray-500 border border-gray-300 rounded-l hover:bg-[#fbe9e7] bg-white transition-colors dark:bg-gray-700"
                            :disabled="currentPage === 1"
                            @click="goToPage(currentPage - 1)"
                        >&lt;</button>
                        <button
                            v-for="page in pageCount"
                            :key="page"
                            class="px-2 py-1 text-xs border border-gray-300"
                            :class="[
                                page === currentPage
                                    ? 'text-indigo-400 dark:bg-gray-600 bg-gray-600'
                                    : 'text-gray-500'
                            ]"
                            @click="goToPage(page)"
                        >{{ page }}</button>
                        <button
                            class="px-2 py-1 text-xs text-gray-500 border border-gray-300 rounded-r hover:bg-[#fbe9e7] bg-white transition-colors dark:bg-gray-700"
                            :disabled="currentPage === pageCount"
                            @click="goToPage(currentPage + 1)"
                        >&gt;</button>
                    </nav>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
const router = useRouter()
const route = useRoute()

const pageSize = 10
const currentPage = ref(1)

const tabs = [
    { key: 'new', label: 'New', count: 33, color: 'bg-gray-500' },
    { key: 'pooling', label: 'Pooling', count: 3, color: 'bg-orange-500' },
    { key: 'shortlisted', label: 'Shortlisted', count: 47, color: 'bg-yellow-400' },
    { key: 'hands-on', label: 'Hands-on', count: 5, color: 'bg-yellow-200' },
    { key: 'final-interview', label: 'Final Interview', count: 3, color: 'bg-lime-300' },
    { key: 'job-offer', label: 'Job Offer', count: 1, color: 'bg-green-400' },
    { key: 'hired', label: 'Hired', count: 1, color: 'bg-green-700' },
]
function goToTab(tabKey: string) {
    router.push({ name: `applicant-directory-${tabKey}` })
}
function isActiveTab(tabKey: string) {
    return route.name === `applicant-directory-${tabKey}`
}
const uniquePositions = computed(() => {
    return [...new Set(applicants.map(a => a.position))]
})
// const staticPositions = [
//     'HR Recruitment',
//     'PHP Developer',
//     'SMM Specialist',
//     'HR Compensation and Benefits',
//     'SEO Analyst',
//     'FDG',
//     'Web Designer',
//     'Web Developer',
// ]
const activeFilter = ref('name')
const searchValue = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const applicants = [
    { position: 'HR Recruitment', name: 'John Michael Smith', dateApplied: 'July 31, 2024', email: 'jmsmith@gmail.com', contact: '09285483729', salary: 18000, datePending: 'August 4, 2024', floatingPhase: 'Initial Interview' },
    { position: 'PHP Developer', name: 'Mary Elizabeth Johnson', dateApplied: 'June 25, 2023', email: 'mjohson@gmail.com', contact: '09878886534', salary: 21000, datePending: 'June 26, 2024', floatingPhase: 'Final Interview' },
    { position: 'SMM Specialist', name: 'Patricia Anne Thompson', dateApplied: 'May 11, 2024', email: 'pthompson@gmail.com', contact: '09878387854', salary: 17000, datePending: 'March 27, 2024', floatingPhase: 'Hands-on Exam' },
    { position: 'SMM Specialist', name: 'Patricia Anne Thompson', dateApplied: 'May 11, 2024', email: 'pthompson@gmail.com', contact: '09878387854', salary: 17000, datePending: 'March 27, 2024', floatingPhase: 'Hands-on Exam' },
    { position: 'SMM Specialist', name: 'Patricia Anne Thompson', dateApplied: 'May 11, 2024', email: 'pthompson@gmail.com', contact: '09878387854', salary: 17000, datePending: 'March 27, 2024', floatingPhase: 'Hands-on Exam' },
    { position: 'SMM Specialist', name: 'Patricia Anne Thompson', dateApplied: 'May 11, 2024', email: 'pthompson@gmail.com', contact: '09878387854', salary: 17000, datePending: 'March 27, 2024', floatingPhase: 'Hands-on Exam' },
    { position: 'SMM Specialist', name: 'Patricia Anne Thompson', dateApplied: 'May 11, 2024', email: 'pthompson@gmail.com', contact: '09878387854', salary: 17000, datePending: 'March 27, 2024', floatingPhase: 'Hands-on Exam' },
    { position: 'SMM Specialist', name: 'Patricia Anne Thompson', dateApplied: 'May 11, 2024', email: 'pthompson@gmail.com', contact: '09878387854', salary: 17000, datePending: 'March 27, 2024', floatingPhase: 'Hands-on Exam' },
    { position: 'SMM Specialist', name: 'Patricia Anne Thompson', dateApplied: 'May 11, 2024', email: 'pthompson@gmail.com', contact: '09878387854', salary: 17000, datePending: 'March 27, 2024', floatingPhase: 'Hands-on Exam' },
    { position: 'SMM Specialist', name: 'Patricia Anne Thompson', dateApplied: 'May 11, 2024', email: 'pthompson@gmail.com', contact: '09878387854', salary: 17000, datePending: 'March 27, 2024', floatingPhase: 'Hands-on Exam' },
    { position: 'SMM Specialist', name: 'Patricia Anne Thompson', dateApplied: 'May 11, 2024', email: 'pthompson@gmail.com', contact: '09878387854', salary: 17000, datePending: 'March 27, 2024', floatingPhase: 'Hands-on Exam' },
    { position: 'SMM Specialist', name: 'Patricia Anne Thompson', dateApplied: 'May 11, 2024', email: 'pthompson@gmail.com', contact: '09878387854', salary: 17000, datePending: 'March 27, 2024', floatingPhase: 'Hands-on Exam' },
    { position: 'SMM Specialist', name: 'Patricia Anne Thompson', dateApplied: 'May 11, 2024', email: 'pthompson@gmail.com', contact: '09878387854', salary: 17000, datePending: 'March 27, 2024', floatingPhase: 'Hands-on Exam' },
    { position: 'SMM Specialist', name: 'Patricia Anne Thompson', dateApplied: 'May 11, 2024', email: 'pthompson@gmail.com', contact: '09878387854', salary: 17000, datePending: 'March 27, 2024', floatingPhase: 'Hands-on Exam' },
    { position: 'SMM Specialist', name: 'Patricia Anne Thompson', dateApplied: 'May 11, 2024', email: 'pthompson@gmail.com', contact: '09878387854', salary: 17000, datePending: 'March 27, 2024', floatingPhase: 'Hands-on Exam' },
]
const filteredApplicants = computed(() => {
    let filtered = applicants
    if (activeFilter.value === 'name') {
        filtered = filtered.filter(a =>
            !searchValue.value || a.name.toLowerCase().includes(searchValue.value.toLowerCase())
        )
    } else if (activeFilter.value === 'position') {
        filtered = filtered.filter(a =>
            !searchValue.value || a.position === searchValue.value
        )
    } else if (activeFilter.value === 'salary') {
        if (!searchValue.value) return filtered
        const [min, max] = searchValue.value.split('-').map(Number)
        filtered = filtered.filter(a => a.salary >= min && a.salary <= max)
    } else if (activeFilter.value === 'date') {
        filtered = filtered.filter(a => {
            const applied = new Date(a.dateApplied)
            const from = dateFrom.value ? new Date(dateFrom.value) : null
            const to = dateTo.value ? new Date(dateTo.value) : null
            if (from && applied < from) return false
            if (to && applied > to) return false
            return true
        })
    }
    return filtered
})
const selected = ref<number[]>([])
const allSelected = computed({
    get() {
        return filteredApplicants.value.length > 0 && filteredApplicants.value.every((_, i) => selected.value.includes(i))
    },
    set(val: boolean) {
        if (val) {
            selected.value = filteredApplicants.value.map((_, i) => i)
        } else {
            selected.value = []
        }
    }
})
function toggleAll() {
    allSelected.value = !allSelected.value
}
watch(activeFilter, () => {
    searchValue.value = ''
    dateFrom.value = ''
    dateTo.value = ''
})

const pageCount = computed(() => Math.ceil(filteredApplicants.value.length / pageSize))

const paginatedApplicants = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredApplicants.value.slice(start, start + pageSize)
})

function goToPage(page: number) {
    if (page < 1 || page > pageCount.value) return
    currentPage.value = page
}

watch(filteredApplicants, () => {
    // Reset to first page if filter changes and current page is out of range
    if (currentPage.value > pageCount.value) currentPage.value = 1
})
</script> 
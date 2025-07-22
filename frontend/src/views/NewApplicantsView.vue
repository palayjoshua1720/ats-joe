<template>
    <div class="py-4">
        <div v-if="route.query.from !== 'petdb' && route.name === 'applicant-directory-new'">
            <h1 class="text-2xl font-bold mb-12">Application Directory</h1>
        </div>
        <div v-if="route.name === 'applicant-directory-new'" class="flex select-none relative z-0">
            <div
                v-for="tab in tabs"
                :key="tab.key"
                @click="goToTab(tab.key)"
                class="flex-1 cursor-pointer border border-purple-200 border-t-0 border-b-0 first:rounded-l last:rounded-r transition-all duration-200"
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
                <div class="mt-4 text-3xl font-bold leading-none">{{ tab.count }}</div>
                <div class="text-xs font-semibold text-gray-700 mt-1">{{ tab.label }}</div>
            </div>
        </div>
        <div v-if="route.name === 'applicant-directory-new'">
            <!-- Card Layout -->
            <div class="bg-white rounded shadow p-6">
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

                <!-- Modern Data Table with Checkbox -->
                <div class="overflow-x-auto border border-gray-100 bg-white">
                    <table class="min-w-full">
                        <thead>
                            <tr class="bg-gray-500 text-white text-xs">
                                <th class="px-2 py-2 w-8 text-center">
                                    <input type="checkbox" :checked="allSelected" @change="toggleAll" class="accent-indigo-500 rounded" />
                                </th>
                                <th class="px-4 py-2 font-semibold">Position</th>
                                <th class="px-4 py-2 font-semibold">Name</th>
                                <th class="px-4 py-2 font-semibold">Date Applied</th>
                                <th class="px-4 py-2 font-semibold">Email</th>
                                <th class="px-4 py-2 font-semibold">Contact Number</th>
                                <th class="px-4 py-2 font-semibold">Expected Salary</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(applicant, i) in filteredApplicants" :key="i" :class="[
                                'transition',
                                applicant.reapplicant ? 'bg-[#fbe9e7]' : 'hover:bg-gray-50',
                                'border-b border-gray-100 last:border-b-0'
                            ]">
                                <td class="px-2 py-2 text-center">
                                    <input type="checkbox" v-model="selected" :value="i" class="accent-indigo-500 rounded" />
                                </td>
                                <td class="px-4 py-2 text-xs text-center">{{ applicant.position }}</td>
                                <td class="px-4 py-2 text-xs text-indigo-700 underline cursor-pointer text-center">
                                    <router-link :to="{ name: 'applicant-directory-new-details', params: { id: i } }" class="text-indigo-700 underline">
                                        {{ applicant.name }}
                                    </router-link>
                                </td>
                                <td class="px-4 py-2 text-xs text-center">{{ applicant.date }}</td>
                                <td class="px-4 py-2 text-xs text-center">{{ applicant.email }}</td>
                                <td class="px-4 py-2 text-xs text-center">{{ applicant.contact }}</td>
                                <td class="px-4 py-2 text-xs text-center">₱{{ applicant.salary }}</td>
                            </tr>
                            <tr v-if="filteredApplicants.length === 0">
                                <td colspan="7" class="text-center text-gray-400 py-6">No applicants found.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Color Legend and Pagination Inline -->
                <div class="flex items-center justify-between mt-4">
                    <div class="bg-gray-100 p-3 rounded flex flex-col w-max">
                        <span class="mb-2"><b>Color Legend</b></span>
                        <div class="flex items-center">
                            <span class="w-4 h-4 rounded bg-orange-200 mr-2"></span>
                            <span>Reapplicants</span>
                        </div>
                    </div>
                    <nav class="inline-flex -space-x-px">
                        <button class="px-2 py-1 text-xs text-gray-500 border border-gray-300 rounded-l hover:bg-[#fbe9e7] bg-white transition-colors">&lt;</button>
                        <button class="px-2 py-1 text-xs text-indigo-600 border-t border-b border-gray-300 bg-white">1</button>
                        <button class="px-2 py-1 text-xs text-gray-500 border-t border-b border-gray-300 bg-white">2</button>
                        <button class="px-2 py-1 text-xs text-gray-500 border-t border-b border-gray-300 bg-white">3</button>
                        <button class="px-2 py-1 text-xs text-gray-500 border-t border-b border-gray-300 bg-white">4</button>
                        <button class="px-2 py-1 text-xs text-gray-500 border-t border-b border-gray-300 bg-white">5</button>
                        <button class="px-2 py-1 text-xs text-gray-500 border-t border-b border-gray-300 bg-white">6</button>
                        <button class="px-2 py-1 text-xs text-gray-500 border-t border-b border-gray-300 bg-white">7</button>
                        <button class="px-2 py-1 text-xs text-gray-500 border border-gray-300 rounded-r hover:bg-[#fbe9e7] bg-white transition-colors">&gt;</button>
                    </nav>
                </div>
            </div>
        </div>
        <router-view />
    </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import type { Ref } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
const router = useRouter()
const route = useRoute()
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
const showFilters = ref(false)
const filterDropdown = ref<HTMLElement | null>(null)
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
function handleClickOutside(event: MouseEvent) {
    if (showFilters.value && filterDropdown.value && !filterDropdown.value.contains(event.target as Node)) {
        showFilters.value = false
    }
}
onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})
const dateFrom = ref('')
const dateTo = ref('')
watch(activeFilter, () => {
    searchValue.value = ''
    dateFrom.value = ''
    dateTo.value = ''
})
const filteredApplicants = computed(() => {
    if (activeFilter.value === 'name') {
        return applicants.filter(a =>
            !searchValue.value || a.name.toLowerCase().includes(searchValue.value.toLowerCase())
        )
    } else if (activeFilter.value === 'position') {
        return applicants.filter(a =>
            !searchValue.value || a.position === searchValue.value
        )
    } else if (activeFilter.value === 'salary') {
        if (!searchValue.value) return applicants
        const [min, max] = searchValue.value.split('-').map(Number)
        return applicants.filter(a => a.salary >= min && a.salary <= max)
    } else if (activeFilter.value === 'date') {
        return applicants.filter(a => {
            if (dateFrom.value && a.date < dateFrom.value) return false
            if (dateTo.value && a.date > dateTo.value) return false
            return true
        })
    }
    return applicants
})
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
function goBack() {
    router.push({ name: 'applicant-directory-new' })
}
// Example: Add a mock function to simulate shortlisting and show the snackbar
function shortlistApplicant(index: number) {
  // ... your shortlisting logic here ...
  toast.success('Applicant successfully shortlisted!')
}
</script>
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
        <div v-if="route.name === 'applicant-directory-new'">
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

                <!-- Modern Data Table with Checkbox -->
                <div class="overflow-x-auto border border-gray-100 bg-white">
                    <table class="min-w-full dark:bg-gray-800">
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
                            <tr v-for="(applicant, i) in paginatedApplicants" :key="i" :class="[
                                'transition',
                                applicant.reapplicant ? 'bg-[#fbe9e7] dark:bg-[#4B2C2A]' : 'hover:bg-gray-50 dark:hover:bg-gray-500',
                                'border-b border-gray-100 last:border-b-0'
                            ]">
                                <td class="px-2 py-2 text-center">
                                    <input type="checkbox" v-model="selected" :value="i + (currentPage-1)*pageSize" class="accent-indigo-500 rounded" />
                                </td>
                                <td class="px-4 py-2 text-xs text-center">{{ applicant.position }}</td>
                                <td class="px-4 py-2 text-xs text-indigo-700 underline cursor-pointer text-center">
                                    <router-link :to="{ name: 'applicant-directory-new-details', params: { id: i + (currentPage-1)*pageSize } }" class="text-indigo-700 underline dark:text-indigo-400">
                                        {{ applicant.name }}
                                    </router-link>
                                </td>
                                <td class="px-4 py-2 text-xs text-center">{{ applicant.date }}</td>
                                <td class="px-4 py-2 text-xs text-center">{{ applicant.email }}</td>
                                <td class="px-4 py-2 text-xs text-center">{{ applicant.contact }}</td>
                                <td class="px-4 py-2 text-xs text-center">₱{{ applicant.salary }}</td>
                            </tr>
                            <tr v-if="paginatedApplicants.length === 0">
                                <td colspan="7" class="text-center text-gray-400 py-6">No applicants found.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Color Legend and Pagination Inline -->
                <div class="flex items-center justify-between mt-4">
                    <div class="bg-gray-100 p-3 rounded flex flex-col w-max dark:bg-gray-700">
                        <span class="mb-2"><b>Color Legend</b></span>
                        <div class="flex items-center">
                            <span class="w-4 h-4 rounded bg-orange-200 mr-2 dark:bg-[#4B2C2A]"></span>
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
        <router-view />
    </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import api from '@/services/api' // ✅ Use centralized axios instance
import 'vue3-toastify/dist/index.css'

const router = useRouter()
const route = useRoute()

const pageSize = 10
const currentPage = ref(1)

const applicants = ref<any[]>([])
const uniquePositions = ref<string[]>([])
const tabs = ref<any[]>([])

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
    fetchApplicants()
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})

async function fetchApplicants() {
    try {
        // ✅ Call Laravel backend using centralized API instance
        const res = await api.get('/applicants')

        applicants.value = res.data.applicants
        uniquePositions.value = res.data.uniquePositions
        tabs.value = res.data.tabs
    } catch (err) {
        console.error('Error fetching applicants:', err)
    }
}

const dateFrom = ref('')
const dateTo = ref('')

watch(activeFilter, () => {
    searchValue.value = ''
    dateFrom.value = ''
    dateTo.value = ''
})

const filteredApplicants = computed(() => {
    let arr = applicants.value
    if (activeFilter.value === 'name') {
        arr = arr.filter(a =>
            !searchValue.value || a.name.toLowerCase().includes(searchValue.value.toLowerCase())
        )
    } else if (activeFilter.value === 'position') {
        arr = arr.filter(a =>
            !searchValue.value || a.position === searchValue.value
        )
    } else if (activeFilter.value === 'salary') {
        if (!searchValue.value) return arr
        const [min, max] = searchValue.value.split('-').map(Number)
        arr = arr.filter(a => a.salary && a.salary >= min && a.salary <= max)
    } else if (activeFilter.value === 'date') {
        arr = arr.filter(a => {
            if (dateFrom.value && a.date < dateFrom.value) return false
            if (dateTo.value && a.date > dateTo.value) return false
            return true
        })
    }
    return arr
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
    if (currentPage.value > pageCount.value) currentPage.value = 1
})

function goToTab(tabKey: string) {
    router.push({ name: `applicant-directory-${tabKey}` })
}

function isActiveTab(tabKey: string) {
    return route.name === `applicant-directory-${tabKey}`
}
</script>


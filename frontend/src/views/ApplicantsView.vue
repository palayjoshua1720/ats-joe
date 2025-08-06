<template>
    <div class="py-4">
        <div>
            <h1 class="text-2xl font-bold">Applications</h1>
        </div>
        <div class="bg-[#BEE0CE] rounded shadow p-6 dark:bg-gray-800">
            <!-- Filter Section -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div class="text-lg font-semibold mb-2 md:mb-0"></div>
                <div class="flex items-center gap-2">
                    <!-- Main Filter Dropdown -->
                    <select v-model="activeFilter" class="input input-bordered input-sm w-36">
                        <option value="name">Name</option>
                        <option value="position">Position</option>
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
                </div>
            </div>
            <!-- Table Section -->
            <div class="overflow-x-auto border border-gray-100 bg-white">
                <table class="min-w-full text-xs dark:bg-gray-800">
                    <thead>
                        <tr class="bg-gray-500 text-white text-xs">
                            <th class="px-2 py-2 w-8 text-center">
                                <input type="checkbox" :checked="allSelected" @change="toggleAll" class="accent-indigo-500 rounded" />
                            </th>
                            <th class="px-4 py-2 font-semibold">Position</th>
                            <th class="px-4 py-2 font-semibold">Name</th>
                            <th class="px-4 py-2 font-semibold">Resume & Interview Notes</th>
                            <th class="px-4 py-2 font-semibold" colspan="2">Hands-on Exam</th>
                            <th class="px-4 py-2 font-semibold" colspan="3">Final Interview</th>
                            <th class="px-4 py-2 font-semibold" colspan="3">Pre-Employment Training</th>
                        </tr>
                        <tr class="bg-gray-200 text-xs dark:bg-gray-800 dark:text-black">
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th class="px-2 py-1 bg-white">Status</th>
                            <th class="px-2 py-1 bg-white">Next Step</th>
                            <th class="px-2 py-1 bg-white">Date</th>
                            <th class="px-2 py-1 bg-white">Time</th>
                            <th class="px-2 py-1 bg-white">Status</th>
                            <th class="px-2 py-1 bg-white">Date</th>
                            <th class="px-2 py-1 bg-white">Time</th>
                            <th class="px-2 py-1 bg-white">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(applicant, i) in paginatedApplicants" :key="i" class="transition border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-500">
                            <td class="px-2 py-2 text-center">
                                <input type="checkbox" v-model="selected" :value="i" class="accent-indigo-500 rounded" />
                            </td>
                            <td class="px-4 py-2 text-xs text-center">{{ applicant.position }}</td>
                            <td class="px-4 py-2 text-xs text-center">{{ applicant.name }}</td>
                            <td class="px-4 py-2 text-xs text-center">
                                <span class="text-indigo-700 underline cursor-pointer">{{ applicant.resume }}</span>
                                <span class="ml-2 cursor-pointer" title="Download">
                                    <ArrowDownTrayIcon class="inline w-4 h-4"/>
                                </span>
                            </td>
                            <td class="px-2 py-2 text-center">
                                <span>{{ applicant.handsOn.status }}</span>
                            </td>
                            <td class="px-2 py-2 text-center">
                                <select v-model="applicant.handsOn.nextStep" class="input input-bordered input-sm">
                                <option value="">Select</option>
                                <option value="Proceed">Proceed</option>
                                <option value="Retake">Retake</option>
                                <option value="Fail">Fail</option>
                                </select>
                            </td>
                            <td class="px-2 py-2 text-center">
                                <input type="date" v-model="applicant.finalInterview.date" class="input input-bordered input-sm" />
                            </td>
                            <td class="px-2 py-2 text-center">
                                <input type="time" v-model="applicant.finalInterview.time" class="input input-bordered input-sm" />
                            </td>
                            <td class="px-2 py-2 text-center">
                                <select v-model="applicant.finalInterview.status" class="input input-bordered input-sm">
                                <option value="">Select</option>
                                <option value="For Job Offer">For Job Offer</option>
                                <option value="Retake">Retake</option>
                                <option value="No Show">No Show</option>
                                </select>
                            </td>
                            <td class="px-2 py-2 text-center">
                                <input type="date" v-model="applicant.training.date" class="input input-bordered input-sm" />
                            </td>
                            <td class="px-2 py-2 text-center">
                                <input type="time" v-model="applicant.training.time" class="input input-bordered input-sm" />
                            </td>
                            <td class="px-2 py-2 text-center">
                                <select v-model="applicant.training.status" class="input input-bordered input-sm">
                                <option value="">Select</option>
                                <option value="For Job Offer">For Job Offer</option>
                                <option value="Retake">Retake</option>
                                <option value="No Show">No Show</option>
                                </select>
                            </td>
                        </tr>
                        <tr v-if="paginatedApplicants.length === 0">
                            <td colspan="12" class="text-center text-gray-400 py-6">No applicants found.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- Pagination -->
            <div class="flex justify-end mt-4">
                <nav class="inline-flex -space-x-px">
                    <button
                        class="px-2 py-1 text-xs text-gray-500 border border-gray-300 rounded-l hover:bg-[#fbe9e7] bg-white transition-colors"
                        :disabled="currentPage === 1"
                        @click="goToPage(currentPage - 1)"
                    >&lt;</button>
                    <button
                        v-for="page in pageCount"
                        :key="page"
                        class="px-2 py-1 text-xs border border-gray-300"
                        :class="[
                            page === currentPage
                                ? 'text-indigo-400 bg-gray-600'
                                : 'text-gray-500 bg-white'
                        ]"
                        @click="goToPage(page)"
                    >{{ page }}</button>
                    <button
                        class="px-2 py-1 text-xs text-gray-500 border border-gray-300 rounded-r hover:bg-[#fbe9e7] bg-white transition-colors"
                        :disabled="currentPage === pageCount"
                        @click="goToPage(currentPage + 1)"
                    >&gt;</button>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ArrowDownTrayIcon } from '@heroicons/vue/24/solid'

const applicants = ref([
    {
        position: 'Web Developer',
        name: 'Benjamin Lucas Carter',
        resume: 'BLCarter.pdf',
        handsOn: { status: 'Passed', nextStep: '' },
        finalInterview: { date: '', time: '', status: '' },
        training: { date: '', time: '', status: '' },
    },
    {
        position: 'Web Developer',
        name: 'Christopher Daniel Evans',
        resume: 'CDEvans.pdf',
        handsOn: { status: 'Passed', nextStep: '' },
        finalInterview: { date: '', time: '', status: '' },
        training: { date: '', time: '', status: '' },
    },
    {
        position: 'Web Developer',
        name: 'Emily Grace Johnson',
        resume: 'EGJohnson.pdf',
        handsOn: { status: 'Passed', nextStep: '' },
        finalInterview: { date: '', time: '', status: '' },
        training: { date: '', time: '', status: '' },
    },
    {
        position: 'Web Developer',
        name: 'Emily Grace Johnson',
        resume: 'EGJohnson.pdf',
        handsOn: { status: 'Passed', nextStep: '' },
        finalInterview: { date: '', time: '', status: '' },
        training: { date: '', time: '', status: '' },
    },
    {
        position: 'Web Developer',
        name: 'Emily Grace Johnson',
        resume: 'EGJohnson.pdf',
        handsOn: { status: 'Passed', nextStep: '' },
        finalInterview: { date: '', time: '', status: '' },
        training: { date: '', time: '', status: '' },
    },
    {
        position: 'Web Developer',
        name: 'Emily Grace Johnson',
        resume: 'EGJohnson.pdf',
        handsOn: { status: 'Passed', nextStep: '' },
        finalInterview: { date: '', time: '', status: '' },
        training: { date: '', time: '', status: '' },
    },
    {
        position: 'Web Developer',
        name: 'Emily Grace Johnson',
        resume: 'EGJohnson.pdf',
        handsOn: { status: 'Passed', nextStep: '' },
        finalInterview: { date: '', time: '', status: '' },
        training: { date: '', time: '', status: '' },
    },
    {
        position: 'Web Developer',
        name: 'Emily Grace Johnson',
        resume: 'EGJohnson.pdf',
        handsOn: { status: 'Passed', nextStep: '' },
        finalInterview: { date: '', time: '', status: '' },
        training: { date: '', time: '', status: '' },
    },
    {
        position: 'Web Developer',
        name: 'Emily Grace Johnson',
        resume: 'EGJohnson.pdf',
        handsOn: { status: 'Passed', nextStep: '' },
        finalInterview: { date: '', time: '', status: '' },
        training: { date: '', time: '', status: '' },
    },
    {
        position: 'Web Developer',
        name: 'Emily Grace Johnson',
        resume: 'EGJohnson.pdf',
        handsOn: { status: 'Passed', nextStep: '' },
        finalInterview: { date: '', time: '', status: '' },
        training: { date: '', time: '', status: '' },
    },
    {
        position: 'Web Developer',
        name: 'Emily Grace Johnson',
        resume: 'EGJohnson.pdf',
        handsOn: { status: 'Passed', nextStep: '' },
        finalInterview: { date: '', time: '', status: '' },
        training: { date: '', time: '', status: '' },
    },
])

const activeFilter = ref('name')
const searchValue = ref('')
const selected = ref<number[]>([])

const uniquePositions = computed(() => {
    return [...new Set(applicants.value.map(a => a.position))]
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
    }
    return arr
})

// Pagination logic
const pageSize = 10
const currentPage = ref(1)
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

const allSelected = computed({
    get() {
        return paginatedApplicants.value.length > 0 && paginatedApplicants.value.every((_, i) => selected.value.includes(i))
    },
    set(val: boolean) {
        if (val) {
        selected.value = paginatedApplicants.value.map((_, i) => i)
        } else {
        selected.value = []
        }
    }
})

function toggleAll() {
    allSelected.value = !allSelected.value
}
</script>
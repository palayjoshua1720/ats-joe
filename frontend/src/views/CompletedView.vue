<template>
    <div class="py-4">
        <div class="bg-white rounded shadow p-6 dark:bg-gray-800">
            <div>
                <h1 class="text-2xl font-bold mb-4">Completed Training Allowance</h1>
            </div>
            <!-- Table Section -->
            <div class="overflow-x-auto border border-gray-100 bg-white">
                <table class="min-w-full text-xs dark:bg-gray-800">
                    <thead>
                        <tr class="bg-purple-400 text-white text-xs">
                            <th class="px-4 py-2 font-semibold">No.</th>
                            <th class="px-4 py-2 font-semibold">Applicant</th>
                            <th class="px-4 py-2 font-semibold">Office Assigned</th>
                            <th class="px-4 py-2 font-semibold">Days</th>
                            <th class="px-4 py-2 font-semibold">First Payout</th>
                            <th class="px-4 py-2 font-semibold">Last Payout</th>
                            <th class="px-4 py-2 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TableLoader v-if="loading" :colspan="10" />
                        <tr 
                            v-for="(applicant, i) in paginatedApplicants" 
                            :key="i" 
                            class="transition border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-500"
                        >
                             <td class="px-4 py-2 text-center">
                                {{ (currentPage - 1) * itemsPerPage + i + 1 }}
                            </td>
                            <td class="px-4 py-2 text-xs text-indigo-700 underline cursor-pointer text-center">
                                <!-- <router-link :to="{ name: 'training-allowance', params: { id: i + (currentPage-1)*pageSize } }" class="text-indigo-700 underline dark:text-indigo-400"> -->
                                    {{ applicant.name }}
                                <!-- </router-link> -->
                            </td>
                            <td class="px-4 py-2 text-xs text-center">{{ applicant.officeAssigned }}</td>
                            <td class="px-4 py-2 text-xs text-center">
                                {{ applicant.days ? applicant.days + ' days' : '' }}
                            </td>
                            <td class="px-4 py-2 text-xs text-center">{{ applicant.firstPayout }}</td>
                            <td class="px-4 py-2 text-xs text-center">{{ applicant.finalPayout }}</td>
                            <td class="px-4 py-2 text-xs text-center">{{ applicant.status }}</td>
                        </tr>

                        <tr v-if="paginatedApplicants.length === 0 && !loading">
                            <td colspan="9" class="text-center text-gray-400 py-6 text-sm">No applicants found.</td>
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
import { ref, computed, watch, onMounted } from 'vue'
import TableLoader from '@/components/ui/TableLoader.vue'

const loading = ref(false)
const applicants = ref<Applicant[]>([])

interface Applicant {
    name: string
    officeAssigned: string
    startDate: string
    endDate: string
    firstPayout: string
    finalPayout: string
    days: number | null
    status: string
}

onMounted(() => {
    loading.value = true
    setTimeout(() => {
        applicants.value = [
                { name: 'Benjamin Lucas Carter', officeAssigned: 'Keppel', startDate: '8/12', endDate: '8/12', firstPayout: '--', finalPayout: '', days: 2, status: 'Completed' },
                { name: 'Christopher Daniel Evans', officeAssigned: 'Keppel', startDate: '8/12', endDate: '8/12', firstPayout: 'Aug, 15, 2025', finalPayout: 'Sept, 15, 2025', days: 15, status: 'Inprogress' },
                { name: 'Emily Grace Johnson', officeAssigned: 'Keppel', startDate: '8/12', endDate: '8/12', firstPayout: '--', finalPayout: 'Sept, 15, 2025', days: 10, status: 'Completed' },
                { name: 'Nathaniel James Brooks', officeAssigned: 'Keppel', startDate: '8/12', endDate: '8/12', firstPayout: 'Aug, 15, 2025', finalPayout: '', days: 0, status: 'Completed' },
                { name: 'Olivia Marie Thompson', officeAssigned: 'Keppel', startDate: '8/12', endDate: '8/12', firstPayout: '--', finalPayout: '', days: 12, status: 'Inprogress' },
                { name: 'Lucas Alexander Scott', officeAssigned: 'Keppel', startDate: '8/12', endDate: '8/12', firstPayout: 'Aug, 15, 2025', finalPayout: 'Sept, 15, 2025', days: 20, status: 'Completed' },
                { name: 'Sophia Isabelle Martinez', officeAssigned: 'Keppel', startDate: '8/12', endDate: '8/12', firstPayout: '--', finalPayout: '', days: 0, status: 'Completed' },
                { name: 'William Henry Foster', officeAssigned: 'Keppel', startDate: '8/12', endDate: '8/12', firstPayout: 'Aug, 15, 2025', finalPayout: '', days: 2, status: 'Inprogress' },
                { name: 'Ava Charlotte Ramirez', officeAssigned: 'Keppel', startDate: '8/12', endDate: '8/12', firstPayout: '--', finalPayout: '', days: 15, status: 'Completed' },
                { name: 'Mason Elijah Bennett', officeAssigned: 'Keppel', startDate: '8/12', endDate: '8/12', firstPayout: 'Aug, 15, 2025', finalPayout: 'Sept, 15, 2025', days: 12, status: 'Inprogress' },
        ]
        loading.value = false
    }, 1500)
})

const activeFilter = ref('name')
const searchValue = ref('')
const itemsPerPage = 10
const selected = ref<number[]>([])

const filteredApplicants = computed(() => {
    let arr = applicants.value
    if (activeFilter.value === 'name') {
        arr = arr.filter(a =>
        !searchValue.value || a.name.toLowerCase().includes(searchValue.value.toLowerCase())
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
<template>
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
		<div class="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg relative notebook-modal dark:bg-gray-800">
			<div class="flex justify-center gap-8 mb-2">
				<div class="flex flex-col items-center">
					<span class="text-xl"><InformationCircleIcon class="w-6 h-6 text-gray-600 dark:text-white" /></span>
					<span class="text-xs mt-1">Properties</span>
				</div>
				<div class="flex flex-col items-center">
					<span class="text-xl"><ArrowDownTrayIcon class="w-6 h-6 text-gray-600 dark:text-white" /></span>
					<span class="text-xs mt-1">Download</span>
				</div>
				<div class="flex flex-col items-center">
					<span class="text-xl"><PrinterIcon class="w-6 h-6 text-gray-600 dark:text-white" /></span>
					<span class="text-xs mt-1">Print</span>
				</div>
			</div>
			<h2 class="text-2xl font-semibold text-center mb-4">Written Note</h2>
			<div class="relative">
				<textarea
					v-model="noteValue"
					class="notebook-textarea w-full h-64 p-4 text-base bg-transparent outline-none resize-none"
					placeholder="Write your note here..."
				></textarea>
				<div class="notebook-lines pointer-events-none absolute inset-0"></div>
			</div>
			<div class="flex justify-end gap-2 mt-6">
				<button class="px-4 py-1 rounded bg-gray-200 dark:bg-gray-400 hover:bg-gray-300 dark:hover:bg-gray-500" @click="$emit('close')">Cancel</button>
				<button class="px-4 py-1 rounded bg-purple-500 text-white hover:bg-purple-600" @click="saveNote">Save</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { InformationCircleIcon, ArrowDownTrayIcon, PrinterIcon } from '@heroicons/vue/24/outline'
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(['update:modelValue', 'close'])
const noteValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
	noteValue.value = val
})

function saveNote() {
	emit('update:modelValue', noteValue.value)
	emit('close')
}
</script>

<style scoped>
.notebook-modal {
	box-shadow: 0 8px 32px rgba(0,0,0,0.18);
}
.notebook-textarea {
	font-family: 'Segoe UI', 'Arial', sans-serif;
	background: transparent;
	border: none;
	z-index: 1;
	position: relative;
}
.notebook-lines {
	position: absolute;
	top: 1.3rem; /* aligns with textarea padding-top */
	left: 0; right: 0; bottom: 0;
	z-index: 0;
	pointer-events: none;
	background-image: repeating-linear-gradient(to bottom, transparent, transparent 21px, #bbb 22px, transparent 23px);
}
</style> 
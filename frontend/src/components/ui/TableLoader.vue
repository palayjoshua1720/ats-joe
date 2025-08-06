<template>
    <tr>
        <td :colspan="colspan" class="pt-10 text-center">
            <div class="inline-block">
                <div class="loader"></div>
            </div>
        </td>
    </tr>
</template>

<script setup lang="ts">
    defineProps({
        colspan: {
            type: Number,
            required: true
        }
    });
</script>

<style scoped>
.loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #8661c5;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    animation: spin 1s linear infinite;
    margin: auto;
}
@keyframes spin {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>

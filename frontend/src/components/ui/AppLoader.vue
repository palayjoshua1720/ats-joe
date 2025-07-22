<template>
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
        <div class="loader"></div>
    </div>
</template>

<style scoped>
.loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #8661c5;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style> 
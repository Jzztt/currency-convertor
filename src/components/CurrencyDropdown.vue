<template>
    <div>
        <label for="currencyDropdown" class="block text-sm font-medium text-gray-700">
            {{ title }}
        </label>

        <div class="relative mt-1">
            <select v-model="selectedCurrency" @change="emitCurrency" id="currencyDropdown"
                class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option v-for="currency in favorites" :key="currency">
                    {{ currency }}
                </option>
                <hr />
                <option v-for="currency in currencies.filter((currency) => !favorites.includes(currency))"
                    :key="currency">
                    {{ currency }}
                </option>

            </select>
            <button @click='handleFavorite(currency)'
                class="absolute inset-y-0 flex items-center pr-5 text-sm leading-5 right-2">
                <Star v-show="isFavorite(currency)" class="w-4 h-4 text-yellow-400 " />
                <Star v-show="!isFavorite(currency)" class="w-4 h-4 " />
            </button>

        </div>
    </div>
</template>

<script setup>
import { Star } from 'lucide-vue-next';
import { ref, watch, } from 'vue';

const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    currencies: {
        type: Array,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    favorites: {
        type: Array,
    }
});

const selectedCurrency = ref(props.currency);
const isFavorite = (currency) => props.favorites.includes(currency);
console.log(selectedCurrency.value);
console.log(props.favorites);




const emit = defineEmits(['updateCurrency', 'handleFavorite']);
const emitCurrency = () => {
    emit('updateCurrency', selectedCurrency.value);
};

const handleFavorite = (currency) => {
    emit('handleFavorite', currency);
};


watch(
    () => props.currency,
    (newCurrency) => {
        selectedCurrency.value = newCurrency;
    }
);



</script>

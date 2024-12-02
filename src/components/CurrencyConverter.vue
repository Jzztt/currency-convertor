<template>
  <div class="max-w-xl p-5 mx-auto my-10 bg-white rounded-lg shadow-md">
    <h2 class="mb-5 text-2xl font-semibold text-gray-700">
      Currency Converter
    </h2>

    <div class="grid items-end grid-cols-1 gap-4 sm:grid-cols-3">
      <CurrencyDropdown :favorites="favorites" :key="fromCurrency" title="From" :currencies=currencies
        :currency=fromCurrency @updateCurrency="handleFromCurrency" @handleFavorite="handleFavorite" />
      <div class="flex justify-center -mb-5 sm:mb-0">
        <button @click="swapCurrencies" class="p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300">
          <ArrowRightLeft class="text-xl text-gray-700" />
        </button>
      </div>
      <CurrencyDropdown :favorites="favorites" :key="toCurrency" title="To" :currency="toCurrency"
        :currencies=currencies @updateCurrency="handleToCurrency" @handleFavorite="handleFavorite" />

    </div>

    <div class="mt-4">
      <label htmlFor="amount" class="block text-sm font-medium text-gray-700">
        Amount:
      </label>
      <input v-model="amount" type="number"
        class="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
    </div>

    <div class="flex justify-end mt-6">
      <button @click="convertCurrency" :class="[
        'px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
        converting ? 'animate-pulse' : ''
      ]">
        Convert
      </button>
    </div>

    <div v-if="convertedAmount" class="mt-4 text-lg font-medium text-right text-green-600">
      Converted Amount: {{ convertedAmount }}
    </div>
    <div v-if="errorMessage" class="mt-4 text-lg font-medium text-right text-red-600">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import CurrencyDropdown from './CurrencyDropdown.vue';
import { ArrowRightLeft } from 'lucide-vue-next';
import instanceAxios from '@/utils/axiosConfig';

const currencies = ref([])
const amount = ref(1);
const fromCurrency = ref("USD");
const toCurrency = ref("VND");
const convertedAmount = ref(null);
const errorMessage = ref('');
const converting = ref(false);

const favorites = reactive(JSON.parse(localStorage.getItem("favorites")) || ["USD", "VND"]);


const swapCurrencies = () => {
  [fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value];
  console.log(fromCurrency.value, toCurrency.value);

};

const handleFavorite = (currency) => {
  if (favorites.includes(currency)) {
    favorites.splice(favorites.indexOf(currency), 1);
  } else {
    favorites.push(currency);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

const handleFromCurrency = (currency) => {
  fromCurrency.value = currency;
}
const handleToCurrency = (currency) => {
  toCurrency.value = currency;
}

const convertCurrency = async () => {
  converting.value = true;
  errorMessage.value = '';
  try {
    const { data } = await instanceAxios.get(`${fromCurrency.value}`);
    const rate = data.conversion_rates[toCurrency.value];
    convertedAmount.value = (amount.value * rate).toFixed(2);
  } catch (error) {
    errorMessage.value = 'Error fetching conversion rate. Please try again.';
    console.error("Error Fetching", error);
  }
  finally {
    converting.value = false;
  }
};


const fetchCurrencies = async () => {
  try {
    errorMessage.value = '';
    const { data } = await instanceAxios.get(`${fromCurrency.value}`);
    currencies.value = Object.keys(data.
      conversion_rates
    );
  } catch (error) {
    errorMessage.value = 'Error fetching currency list. Please try again.';
    console.error("Error Fetching", error);
  }
};


onMounted(fetchCurrencies);

</script>

<style lang="scss" scoped></style>
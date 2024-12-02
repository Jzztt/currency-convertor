import axios from 'axios'

const apiKey = import.meta.env.VITE_API_KEY
const instanceAxios = axios.create({
  baseURL: `https://v6.exchangerate-api.com/v6/${apiKey}/latest/`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
export default instanceAxios

import axios from 'axios'
import {BASE_URL} from './url.js'
 
const API = axios.create({
  baseURL: BASE_URL
})

export { API }
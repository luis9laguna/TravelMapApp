import axios from 'axios'

const clientAxios = axios.create({
    baseURL: process.env.REACT_APP_BACK_END
})

export default clientAxios
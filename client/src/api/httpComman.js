import axios from 'axios'
const perfix = 'v1'

const httpComman = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL + perfix,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default httpComman;

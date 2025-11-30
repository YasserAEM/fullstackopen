import axios from "axios"
const baseUrl = "http://localhost:3001/persons"

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data)
}

const create = (person) => {
    return axios.post(baseUrl, person).then(response => response.data)
}

const remove = (id) => {
    axios.delete(`${baseUrl}/${id}`)
}

const update = (updatedPerson) => {
    return axios.put(`${baseUrl}/${updatedPerson.id}`, updatedPerson).then(response => response.data)
}

export default { getAll, create, remove, update }
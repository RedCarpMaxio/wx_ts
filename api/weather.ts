import AxiosService from '../config/axios'

const request = new AxiosService('http://127.0.0.1:8081');

export const getWeather = async (city: string) => {
    return await request.get('/weather/get?city='+city)
}
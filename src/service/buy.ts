import axios from 'axios';

export class BuyService{
    static findAll = async () => {
        try {
            const response = await axios.get('https://222.255.1.152:4600/buy');
            return response.data.data
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return error.response?.data
              } else {
                console.log('Unexpected Error:', error);
              }
        }
    }
}
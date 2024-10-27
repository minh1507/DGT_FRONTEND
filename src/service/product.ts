import axios from 'axios';

export class ProductService{
    static findAll = async () => {
        try {
            const response = await axios.get('https://222.255.1.152:4600/product');
            return response.data.data
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return error.response?.data
              } else {
                console.log('Unexpected Error:', error);
              }
        }
    }

    static create = async (data: any) => {
        try {
            const response = await axios.post('https://222.255.1.152:4600/product', data, {
                headers: {
                  'Content-Type': 'application/json',
                }
            });
            
            return response.data
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return error.response?.data
              } else {
                console.log('Unexpected Error:', error);
              }
        }
    }

    static update = async (data: any, id: number) => {
        try {
            const response = await axios.patch('https://222.255.1.152:4600/product/' + id, data, {
                headers: {
                  'Content-Type': 'application/json',
                }
            });
            
            return response.data
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return error.response?.data
              } else {
                console.log('Unexpected Error:', error);
              }
        }
    }

    static delete = async (id: number) => {
        try {
            const response = await axios.delete('https://222.255.1.152:4600/product/' + id);
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
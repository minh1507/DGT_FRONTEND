import axios from 'axios';
import { ICategory } from '../module/category/type/category';

export class CategoryService{
    static findAll = async () => {
        try {
            const response = await axios.get('https://222.255.1.152:4600/category', {
                params: {
                    limit: 500,
                    offset: 0
                }
            });
            return response.data.data
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return error.response?.data
              } else {
                console.log('Unexpected Error:', error);
              }
        }
    }

    static create = async (data: ICategory) => {
        try {
            const response = await axios.post('https://222.255.1.152:4600/category', data, {
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

    static update = async (data: ICategory, id: number) => {
        try {
            const response = await axios.patch('https://222.255.1.152:4600/category/' + id, data, {
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
            const response = await axios.delete('http://222.255.1.152:4600/category/' + id);
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
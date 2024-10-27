import axios from 'axios';

export class AuthService{
    static login = async (username: string, password: string) => {
        try {
            const response = await axios.post('https://redy.site:3500/api/auth/login/', {
                username,
                password,
                apiKey: '31f5b93e-17b9-4113-bd82-3c5d70d2c028'
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
}
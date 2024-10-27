import axios from 'axios';

export class FileService{
    static findAll = async () => {
        try {
            const response = await axios.get('https://222.255.1.152:4600/file');
            const files = response.data.data;
    
            // Fetch image for each file and add `imageURL` to each file object
            const filesWithImages = await Promise.all(
                files.map(async (file:any) => {
                    try {
                        const imageResponse = await axios.get(`https://222.255.1.152:4600/file/${file.file}`);
                        return { ...file, imageURL: imageResponse.data.data }; // Assuming 'data' contains the image URL
                    } catch (imageError) {
                        console.log(`Error fetching image for file ${file.file}`, imageError);
                        return file; // Return the file without image if there's an error
                    }
                })
            );
    
            return filesWithImages;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return error.response?.data;
            } else {
                console.log('Unexpected Error:', error);
            }
        }
    };
    

    static findOne = async (id: string) => {
        try {
            const response = await axios.get('https://222.255.1.152:4600/file/' + id);
            console.log(response.data.data)
            return response.data.data
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return error.response?.data
              } else {
                console.log('Unexpected Error:', error);
              }
        }
    }

    static async create(formData: FormData) {
        const response = await axios.post('https://222.255.1.152:4600/file/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      }

      static delete = async (id: number) => {
        try {
            const response = await axios.delete('https://222.255.1.152:4600/file/' + id);
            console.log(response.data.data)
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
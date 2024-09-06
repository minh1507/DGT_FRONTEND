class StringUtil{
    static firstLetterUppercase = (value: string) => {
        const temp = value.split('')
        temp[0] = temp[0].toUpperCase()
        return temp.join('')
    }
}

export default StringUtil;
export default function GetToken() {
        const token = localStorage.getItem('token')
        if(token)return token
        else return null 
}

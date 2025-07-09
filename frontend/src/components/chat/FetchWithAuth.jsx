import { API_BASE_URL } from "../../config"

const FetchWithAuth = async( url, navigate ) => {

    console.log("in FetchWithAuth")
    const tabId = sessionStorage.getItem('tabId')
    const token = sessionStorage.getItem(`token_${tabId}`)

    const res = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
    })

    if(res.status === 401){
        console.warn('Session expired. Please log in again.')
        sessionStorage.removeItem(`token_${tabId}`);
        sessionStorage.removeItem(`curUser_${tabId}`);
        navigate('/login');
    }

    return res
}

export default FetchWithAuth
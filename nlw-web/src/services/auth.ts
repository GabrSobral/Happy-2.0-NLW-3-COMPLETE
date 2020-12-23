
export const TOKEN_KEY = "@QEGTUI";

export const isAuthenticated = () => {
  return(
    localStorage.getItem(TOKEN_KEY) !== null ||
    sessionStorage.getItem(TOKEN_KEY) !== null
  )
}

export const getToken = () => {
    
      if(localStorage.getItem(TOKEN_KEY) === null){
        return sessionStorage.getItem(TOKEN_KEY)
      }else {
        return localStorage.getItem(TOKEN_KEY)
      }
}

export const login = (token : string, remember: boolean) => {

  if(remember){
    localStorage.setItem(TOKEN_KEY, token)
    return
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    return
  } 
  
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY)
};



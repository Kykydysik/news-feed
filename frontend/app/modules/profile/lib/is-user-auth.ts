// переделать это на класс
export const isUserAuth = () => {
  const token = localStorage.getItem('token')

  return Boolean(token);
}

export const saveToken = (token: string) => {
  localStorage.setItem('token', token)
}
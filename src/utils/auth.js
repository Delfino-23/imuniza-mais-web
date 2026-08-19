export const getUser = () => {
    const user = localStorage.getItem("@imuniza:user");
    return user ? JSON.parse(user) : null;
}
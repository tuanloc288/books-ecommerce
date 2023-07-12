export const getCurrentDate = () => {
    const d = new Date()
    return d.toLocaleDateString() + ' -- ' + d.toLocaleTimeString()
}
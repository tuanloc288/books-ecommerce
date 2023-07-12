export const randomColor = () => {
    return 'rgba(' + Math.round(Math.random() * 255) + ',' 
                   + Math.round(Math.random() * 255) + ','
                   + Math.round(Math.random() * 255) + ','
                   + 1
                   + ')'
}

export const multipleColor = (length) => {
    let arrayOfColor = []
    for(let i = 0 ; i < length; i++){
        let random = randomColor()
        if(!arrayOfColor.includes(random))
            arrayOfColor.push(random)
    }
    return arrayOfColor
}

export const getCurrentDate = () => {
    const d = new Date()
    return d.toLocaleDateString() + ' -- ' + d.toLocaleTimeString()
}
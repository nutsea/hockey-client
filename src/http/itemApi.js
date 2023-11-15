import { $host } from '.'

export const fetchBrands = async () => {
    const { data } = await $host.get('api/item/brands')
    return data
}

export const fetchGrips = async () => {
    const { data } = await $host.get('api/item/grips')
    return data
}

export const fetchBends = async () => {
    const { data } = await $host.get('api/item/bends')
    return data
}

export const fetchRigidities = async () => {
    const { data } = await $host.get('api/item/rigidities')
    return data
}

export const fetchMin = async () => {
    const { data } = await $host.get('api/item/min')
    return data
}

export const fetchMax = async () => {
    const { data } = await $host.get('api/item/max')
    return data
}

export const fetchItems = async (brands, grips, bends, rigidities, type, priceMin, priceMax, limit, page) => {
    try {
        const { data } = await $host.get('api/item/all', { params: { brands, grips, bends, rigidities, type, priceMin, priceMax, limit, page } })
        return data
    } catch (e) {
        return null
    }
}

export const findItem = async (id) => {
    const { data } = await $host.get('api/item/one/' + id)
    return data
}

export const findSameItems = async (code) => {
    const { data } = await $host.get('api/item/same', { params: { code } })
    return data
}

export const findImages = async (code) => {
    const { data } = await $host.get('api/image', { params: { code } })
    return data
}

export const getCount = async (code, grip, bend, rigidity) => {
    const { data } = await $host.get('api/item/count', { params: { code, grip, bend, rigidity } })
    return data
}

export const fetchOriginals = async () => {
    const { data } = await $host.get('api/item/originals')
    return data
}

export const fetchReplicas = async () => {
    const { data } = await $host.get('api/item/replicas')
    return data
}

export const fetchRestored = async () => {
    const { data } = await $host.get('api/item/restored')
    return data
}

export const deleteItems = async (idArr) => {
    const { data } = await $host.delete('api/item/many', { params: { idArr } })
    return data
}

export const addNew = async (code, brand, name, description, price, grip, bend, rigidity, type, count, renew, img) => {
    const formData = new FormData()
    formData.append('code', code)
    formData.append('brand', brand)
    formData.append('name', name)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('grip', grip)
    formData.append('bend', bend)
    formData.append('rigidity', rigidity)
    formData.append('type', type)
    formData.append('count', count)
    formData.append('renew', renew)
    formData.append('img', img)

    const { data } = await $host.post('api/item', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return data
}

// export const createNew = async (code, brand, name, description, price, grip, bend, rigidity, type, count, renew, img, files) => {
//     addNew(code, brand, name, description, price, grip, bend, rigidity, type, count, renew, img).then(async (data) => {
//         let item_code = data.id
//         const formData = new FormData()
//         formData.append('item_code', item_code)
//         let images = []
//         for (let i of files) {
//             images.push(i)
//         }
//         images.forEach((image) => {
//             formData.append('img', image)
//         })
//         const { data2 } = await $host.post('api/image', formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         })
//         return data2
//     })
// }

export const createNew = async (code, brand, name, description, price, grip, bend, rigidity, type, count, renew, img, files) => {
    return new Promise(async (resolve, reject) => {
        try {
            await addNew(code, brand, name, description, price, grip, bend, rigidity, type, count, renew, img)
                .then(async (data) => {
                    let item_code = data.id
                    const formData = new FormData()
                    formData.append('item_code', item_code)

                    for (let i of files) {
                        formData.append('img', i)
                    }

                    const { data: data2 } = await $host.post('api/image', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })

                    resolve(data2)
                })
        } catch (error) {
            reject(error)
        }
    })
}

export const addOld = async (code, brand, name, description, price, grip, bend, rigidity, type, renew) => {
    const { data } = await $host.post('api/item', { code, brand, name, description, price, grip, bend, rigidity, type, renew })
    return data
}

export const updateItem = async (id, code, brand, name, description, price, grip, bend, rigidity, count, renew, img) => {
    const formData = new FormData()
    formData.append('id', id)
    formData.append('code', code)
    formData.append('brand', brand)
    formData.append('name', name)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('grip', grip)
    formData.append('bend', bend)
    formData.append('rigidity', rigidity)
    formData.append('count', count)
    formData.append('renew', renew)
    formData.append('img', img)

    const { data } = await $host.post('api/item/update', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return data
}

export const updateItemAndImages = async (id, code, brand, name, description, price, grip, bend, rigidity, count, renew, img, images, deleteImages) => {
    return new Promise(async (resolve, reject) => {
        try {
            await updateItem(id, code, brand, name, description, price, grip, bend, rigidity, count, renew, img)
                .then(async (data) => {
                    let item_code = data.id
                    const formData = new FormData()
                    formData.append('item_code', item_code)

                    let newImages = []

                    if (images) {
                        for (let i of images) {
                            newImages.push(i)
                        }
                    }

                    newImages.forEach((image) => {
                        formData.append('img', image)
                    })

                    // if (images) {
                    //     for (let i of images) {
                    //         formData.append('img', i)
                    //     }
                    // }

                    console.log(newImages)

                    const { data: data2 } = await $host.post('api/image', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })

                    let toDelete = []

                    if (deleteImages) {
                        for (let i of deleteImages) {
                            toDelete.push(i)
                        }
                    }

                    const { data: data3 } = await $host.delete('api/image', { params: { toDelete } })

                    resolve(data2, data3)
                })
        } catch (error) {
            reject(error)
        }
    })
}
const ArrayClient = [
    'file1.png', null,
    null, null,
    null, null,
    null, null,
    'file9.png'
]

const ArrayModi = [
    'file1-9023ad6b-9563-4f38-b2d8-a993bb66bf08.png',
    'file9-1d26a336-f56b-498c-a5f6-bff4cc71df92.png'
]

const ArrayUpdate = [

]

let arrayIndex = 0

ArrayClient.map((file, index) => {
    if (file === null) {
        ArrayUpdate.push(null)
    } else {
        ArrayUpdate[index] = ArrayModi[arrayIndex]
        arrayIndex++;
    }
})

console.log(ArrayUpdate)
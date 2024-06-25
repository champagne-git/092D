const fs = require('fs')

const readFileAndParseData = filePath => {
    const data = fs
        .readFileSync(filePath, 'utf8')
        .split('\n')
        .filter(item => item.length != 0)
    const result = {}
    data.forEach(line => {
        const arr = line.split('\t')
        if (arr[1].includes(' ')) {
            result[arr[0]] = arr[1].split(' ')
        } else {
            result[arr[0]] = arr[1]
        }
    })
    return result
}

const writeToFile = (data, filePath) => {
    const result = data.map(item => {
        return `${item.char}\t${item.code}`
    })
    fs.writeFile(filePath, result.join('\n'), 'utf8', err => {
        if (err) {
            console.error('写入文件时出错:', err)
            return
        }
        console.log('文本文件已成功导出！' + filePath)
    })
}

const generateDict = (cf, keymap) => {
    const result = []

    for (const key in cf) {
        const codes = cf[key].map(item => keymap[item])
        result.push({
            char: key,
            code: codes.join('')
        })
    }

    return result
}

const main = () => {
    const chaiFenData = readFileAndParseData('../info/chaifen.txt')
    const keymap = readFileAndParseData('../info/keymap.txt')
    const dict = generateDict(chaiFenData, keymap)
    writeToFile(dict, '../output/output_dz_qm.txt')
}

main()

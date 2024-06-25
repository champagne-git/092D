const fs = require('fs')

const readFileAndParseData = filePath => {
    const data = fs
        .readFileSync(filePath, 'utf8')
        .split('\n')
        .filter(item => item.length != 0)
    const result = {}
    data.forEach(line => {
        const arr = line.split('\t')
        if (arr[1]) {
            if (arr[1].includes(' ')) {
                result[arr[0]] = arr[1].split(' ')
            } else {
                result[arr[0]] = arr[1]
            }
        }
    })
    if (JSON.stringify(result) === '{}') return data
    return result
}

const writeToFile = (data, filePath) => {
    const result = data.map(item => {
        return `${item.word}\t${item.code}`
    })
    fs.writeFile(filePath, result.join('\n'), 'utf8', err => {
        if (err) {
            console.error('写入文件时出错:', err)
            return
        }
        console.log('文本文件已成功导出！' + filePath)
    })
}

const generateDict = (dz, cz) => {
    return cz.map(item => {
        let code = ''

        if (item.length == 2) {
            code = dz[item[0]][0] + dz[item[0]][1] + dz[item[1]][0] + dz[item[1]][1]
        } else if (item.length == 3) {
            code = dz[item[0]][0] + dz[item[1]][0] + dz[item[2]][0] + dz[item[2]][1]
        } else {
            code = dz[item[0]][0] + dz[item[1]][0] + dz[item[2]][0] + dz[item[item.length - 1]][0]
        }

        return {
            word: item,
            code
        }
    })
}

const main = () => {
    const danZiData = readFileAndParseData('../output/output_dz_qm.txt')
    const ciZuData = readFileAndParseData('./cizu.txt')
    const dict = generateDict(danZiData, ciZuData)
    writeToFile(dict, '../output/output_cz_qm.txt')
}

main()

const fs = require('fs')
const { min_length } = require('./config')

// 读取并转换格式
const readFileAndParseData = filePath => {
    const data = fs
        .readFileSync(filePath, 'utf8')
        .split('\n')
        .filter(item => item.length != 0)
    const result = {}
    data.forEach(line => {
        const arr = line.split('\t')
        result[arr[0]] = arr[1]
    })
    return result
}

// 生成
const generateShortCode = (dz, wl) => {
    const dict = { ...wl }

    for (let key in dz) {
        if (!dict[key]) {
            let shortLength = min_length

            for (let k in dict) {
                if (dz[key].slice(0, shortLength) === dict[k]) {
                    shortLength++
                }
            }

            dict[key] = dz[key].slice(0, shortLength)
        }
    }

    return dict
}

const formatData = data => {
    return Object.keys(data).map(key => {
        try {
            return `${key}\t${data[key]}`
        } catch (err) {
            return
        }
    })
}

const writeToFile = (filePath, data) => {
    fs.writeFile(filePath, data.join('\n'), 'utf8', err => {
        if (err) {
            console.error('写入文件时出错:', err)
            return
        }
        console.log('文本文件已成功导出！' + filePath)
    })
}

const main = () => {
    const dz = readFileAndParseData('../output/output_px_dz.txt')
    const wl = readFileAndParseData('./wl.txt')
    const dict = generateShortCode(dz, wl)
    const formattedData = formatData(dict)
    writeToFile('../output/output_dz_jm.txt', formattedData)
}

main()

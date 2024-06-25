const fs = require('fs')
const { output_frequency, frequency_mb } = require('./config')

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

// 排序
const sortDict = (dz, frequency) => {
    const dict = []

    for (const key in dz) {
        const fr = frequency[key]
        const o = {
            key,
            value: dz[key]
        }
        if (fr !== undefined) {
            o.frequency = fr
        } else {
            o.frequency = 0
        }
        dict.push(o)
    }

    dict.sort((a, b) => b.frequency - a.frequency)

    return dict
}

const formatData = data => {
    return data.map(item => {
        return output_frequency
            ? `${item.key}\t${item.value}\t${item.frequency}`
            : `${item.key}\t${item.value}`
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
    const dz = readFileAndParseData('../output/output_dz_qm.txt')
    const frequency = readFileAndParseData(`../info/frequency${frequency_mb}.txt`)
    const dict = sortDict(dz, frequency)
    const formattedData = formatData(dict)
    writeToFile('../output/output_px_dz.txt', formattedData)
}

main()

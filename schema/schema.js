const fs = require('fs')

const readFileAndParseData = filePath => {
    const data = fs
        .readFileSync(filePath, 'utf8')
        .split('\n')
        .filter(item => item.length != 0)
    return data.map(item => {
        const line = item.split('\t')
        return {
            key: line[0],
            value: line[1]
        }
    })
}

const writeToFile = (data, filePath) => {
    const header = ['---', 'name: 092', "version: 'Q1'", 'sort: original', '...', '']

    const result = data.map(item => `${item.key}\t${item.value}`)
    const content = header.concat(result).join('\n')

    fs.writeFile(filePath, content, 'utf8', err => {
        if (err) {
            console.error('写入文件时出错:', err)
            return
        }
        console.log('文本文件已成功导出！' + filePath)
    })
}

const main = () => {
    const danZiData = readFileAndParseData('../output/output_dz_jm.txt')
    const ciZuData = readFileAndParseData('../output/output_px_cz.txt')
    const dict = danZiData.concat(ciZuData)
    writeToFile(dict, './092.dict.yaml')
    // const dict = generateDict(chaiFenData, keymap)
}

main()

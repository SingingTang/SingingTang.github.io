
const PHRASE = [ '行尸走肉', '金蝉脱壳', '百里挑一', '金玉满堂', '背水一战', '霸王别姬', '天上人间', '不吐不快', '海阔天空', '情非得已', '满腹经纶', '兵临城下', '春暖花开', '插翅难逃', '黄道吉日', '天下无双', '偷天换日', '两小无猜', '卧虎藏龙', '珠光宝气', '簪缨世族', '花花公子', '绘声绘影', '国色天香', '相亲相爱', '八仙过海', '金玉良缘', '掌上明珠', '皆大欢喜', '逍遥法外']

const PHRASEWIDTH = 80

const request = (url, callback) => {

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            var data = JSON.parse(xhr.responseText)
            callback(data)
        } else {
            console.log(xhr)
            
        }
    }

    xhr.open('GET', url);
    xhr.send(null);
}
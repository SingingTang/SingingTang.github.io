

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


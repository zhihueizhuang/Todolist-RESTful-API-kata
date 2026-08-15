const headers = require("./headers.js"); //引入headers.js檔案，取得headers物件

function errorHandle(response,message = "請求格式不正確，請檢查後再重新送出"){ 

    response.writeHead(400,headers);
    response.write(JSON.stringify({
        "status":"false",
        "message":message //動態變數，外面傳什麼就顯示什麼，沒傳就顯示預設值
    }));
    response.end();
}

module.exports = errorHandle;
function errorHandle(response){
    const headers = { //允許在不同的網域之間進行請求
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With', 
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'

    }
    response.writeHead(400,headers);
    response.write(JSON.stringify({
        "status":"false",
        "message": "欄位未填寫正確，或無此欄位"
    }));
    response.end();
}

module.exports = errorHandle;
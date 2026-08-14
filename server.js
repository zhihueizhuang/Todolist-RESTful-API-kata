const http = require("http");
const { v4: uuidv4 } = require("uuid"); //用來產生唯一的ID
const errorHandle = require("./errorHandle.js"); //引入errorHandle.js模組(錯誤處理模組)
const todos = []; //用來存放待辦事項的陣列，暫時存放在Nnode.js的記憶體上做讀取 

const requestListener = (request,response)=>{
    const headers = { //允許在不同的網域之間進行請求
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With', 
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'

    }
    let body = ""; //接收前端傳送過來的資料

    request.on("data",(chunk)=>{ //當前端傳送資料過來時，會觸發data事件，並將資料分段傳送過來
        body += chunk;
    });
    if(request.url == "/todos" && request.method == "GET"){ 
        response.writeHead(200,headers);
        response.write(JSON.stringify({
            "status":"success",
            "data": todos
        }));
        response.end();
    }else if(request.url == "/todos" && request.method == "POST"){
        request.on("end",()=>{ //觸發累加完獲得完整的body資料後，會觸發end事件
            try{
                const title = JSON.parse(body).title; //將body資料轉換成JSON格式，並取出title屬性
                if(title !== undefined){ //如果title屬性存在，表示前端有傳送title欄位，就算是錯誤的也會傳
                    const todo = {
                        "title": title,
                        "id": uuidv4()
                    };
                    todos.push(todo); //將新的待辦事項加入陣列中
                    response.writeHead(200,headers);
                    response.write(JSON.stringify({
                        "status":"success",
                        "data": todos
                    }));
                    response.end();
                }else{
                    errorHandle(response); //如果title屬性不存在，表示前端沒有傳送title欄位，就會呼叫errorHandle函式，回傳錯誤訊息
                }
            }catch(error){ //如果JSON.parse(body)失敗，會進入catch區塊，表示前端傳送的資料格式不正確
                errorHandle(response); //呼叫errorHandle函式，回傳錯誤訊息
            };
            
        });

    }else if(request.url == "/todos" && request.method == "DELETE"){ //刪除所有代辦
        todos.length = 0; //清空陣列
        response.writeHead(200,headers);
        response.write(JSON.stringify({
            "status":"success",
            "data": todos,
            "delete": "yes"
        }));
        response.end();
    }else if(request.url.startsWith("/todos/") && request.method == "DELETE"){ //刪除單筆代辦
        const id = request.url.split("/").pop(); //取得網址最後一個斜線後的字串，作為待辦事項的ID(先撈uuid)
        const index = todos.findIndex(element => element.id === id); //在陣列中尋找符合ID的待辦事項，並回傳其索引值
        if (index !== -1) {  //如果找到符合ID的待辦事項，則回傳其索引值，否則回傳-1
            todos.splice(index, 1); //從陣列中移除符合ID的待辦事項
            response.writeHead(200,headers);
            response.write(JSON.stringify({
                "status":"success",
                "data": todos
            }));
            response.end();
        }else{
            errorHandle(response); //如果找不到符合ID的待辦事項，則呼叫errorHandle函式，回傳錯誤訊息
        }
    }else if(request.url.startsWith("/todos/") && request.method == "PATCH"){ //編輯單筆代辦
        request.on("end",()=>{ //觸發累加完獲得完整的body資料後，會觸發end事件
            try{
                const todo = JSON.parse(body).title; //將body資料轉換成JSON格式，並取出title屬性
                const id = request.url.split("/").pop(); //取得網址最後一個斜線後的字串，作為待辦事項的ID(先撈uuid)
                const index = todos.findIndex(element => element.id === id); //在陣列中尋找符合ID的待辦事項，並回傳其索引值
                if(todo !== undefined && index !== -1){ //如果title屬性存在，表示前端有傳送title欄位，就算是錯誤的也會傳，且找到符合ID的待辦事項，則回傳其索引值，否則回傳-1
                    todos[index].title = todo; //將符合ID的待辦事項的title屬性更新為新的title
                    response.writeHead(200,headers);
                    response.write(JSON.stringify({
                        "status":"success",
                        "data": todos
                    }));
                    response.end();
                }else{
                    errorHandle(response); //如果title屬性不存在，表示前端沒有傳送title欄位，就會呼叫errorHandle函式，回傳錯誤訊息
                }
            }catch{
                errorHandle(response);
            }
        });
    }else if(request.method == "OPTIONS"){
        response.writeHead(200,headers);
        response.end();
    }else {
        response.writeHead(404,headers);
        response.write(JSON.stringify({
            "status":"false",
            "message": "無此網路路由"
        }));
        response.end();
    }
}

const server = http.createServer(requestListener);
server.listen(3005);



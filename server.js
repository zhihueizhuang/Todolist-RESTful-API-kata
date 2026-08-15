const http = require("http");
const { v4: uuidv4 } = require("uuid"); //用來產生唯一的ID
const errorHandle = require("./errorHandle.js"); //引入errorHandle.js模組(錯誤處理模組)
const headers = require("./headers.js"); //引入headers.js檔案，取得headers物件
const todos = []; //用來存放待辦事項的陣列，暫時存放在Nnode.js的記憶體上做讀取 

const requestListener = (request,response)=>{
    
    let body = ""; //接收前端傳送過來的資料

    request.on("data",(chunk)=>{ //當前端傳送資料過來時，會觸發data事件，並將資料分段傳送過來
        body += chunk;
    });

    if(request.url == "/todos" && request.method == "GET"){  //1. 取得所有代辦事項 (GET /todos)
        response.writeHead(200,headers);
        response.write(JSON.stringify({
            "status":"success",
            "data": todos
        }));
        response.end();

    }else if(request.url == "/todos" && request.method == "POST"){  //2. 新增單筆代辦事項 (POST /todos)
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

    }else if(request.url == "/todos" && request.method == "DELETE"){ //3. 刪除所有代辦事項(DELETE /todos)
        todos.length = 0; //清空陣列
        response.writeHead(200,headers);
        response.write(JSON.stringify({
            "status":"success",
            "data": todos,
            "delete": "yes"
        }));
        response.end();

    }else if(request.url.startsWith("/todos/") && request.method == "DELETE"){ //4. 刪除單筆代辦事項 (DELETE /todos/:id)
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
            errorHandle(response,"刪除失敗，找不到符合ID的待辦事項"); //呼叫errorHandle函式，回傳錯誤訊息(傳入特定文字，蓋掉預設字)
        }

    }else if(request.url.startsWith("/todos/") && request.method == "PATCH"){ //5. 編輯單筆代辦事項 (PATCH /todos/:id)
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
                    errorHandle(response,"修改失敗，更新的title欄位不存在"); //如果title屬性不存在，表示前端沒有傳送title欄位，就會呼叫errorHandle函式，回傳錯誤訊息
                }
            }catch{
                errorHandle(response,"修改失敗，找不到符合ID的待辦事項"); //如果JSON.parse(body)失敗，會進入catch區塊，表示前端傳送的資料格式不正確，就會呼叫errorHandle函式，回傳錯誤訊息
            }
        });

    }else if(request.method == "OPTIONS"){  //6. 處理跨域請求的預檢請求 (OPTIONS /todos)
        response.writeHead(200,headers);
        response.end();

    }else { //7. 如果以上條件都不符合，表示請求的路由不存在，回傳404 Not Found
        response.writeHead(404,headers);
        response.write(JSON.stringify({
            "status":"false",
            "message": "無此網路路由"
        }));
        response.end();
    }
};

const port = process.env.PORT || 3005; //設定監聽的埠口，若有設定環境變數PORT則使用該埠口，沒有則使用3005

const server = http.createServer(requestListener);
server.listen(port,()=>{
    //啟動成功在終端機印出提示，部屬到Render後方便在Render的log中看到伺服器啟動成功的訊息
    console.log(`伺服器已啟動，監聽埠口 ${port}`);
}); 

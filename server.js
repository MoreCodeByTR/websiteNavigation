var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

// var routes = {
//     './data/article.json': function (req, res) {
//         var obj = {};
//         req.msg.split('&').forEach(function (item, i) {
//             obj[item.split('=')[0]] = item.split('=')[1];
//         });

//         // res.setHeader("Content-Type", "text/html; charset=utf-8");
//         // res.end('名字是:' + obj.name + ' , 年龄:' + obj.age);

//         // 解码post
//         var params = {
//             "name": decodeURIComponent(decodeURI(obj.article_title)),   
//             "href":decodeURIComponent(decodeURI(obj.article_href))
//         }

//         console.log(params);
//         writeJson(params);
//     }
// }

http.createServer(function (request, response) {

    var pathname = url.parse(request.url).pathname;
    var postfix = pathname.match(/(\.[^.]+|)$/)[0];

    console.log("Request for " + pathname + " received.");

    // var pathObj = url.parse(request.url, true);

    if (request.url === '/login') {
        var alldata = '';
        request.on('data', function (chunk) {
            alldata += chunk;
        });

        request.on('end', function () {
            response.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });

            request.alldata = alldata;
            var obj = {};
            request.alldata.split('&').forEach(function (item, i) {
                obj[item.split('=')[0]] = item.split('=')[1];
            });
            console.log('--接收'+alldata);
            console.log(obj)

            var params = {
                "name": decodeURIComponent(decodeURI(obj.article_title)),
                "href": decodeURIComponent(decodeURI(obj.article_href))
            }

            writeJson(params);
            response.end("hello");
        })
    } else {
        // sunstr()方法用于截取字符串长度.
        fs.readFile(pathname.substr(1), function (err, data) {
            if (err) {
                console.log(err);

                response.writeHead(404, { 'Content-Type': 'text/html' });
            }
            else {
                // response.writeHead(200, { 'Content-Type': 'text/html' });
                if (postfix === 'html') {
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                } else if (postfix === 'css') {
                    response.writeHead(200, { 'Content-Type': 'text/css' });
                }
                else if (postfix === 'js') {
                    response.writeHead(200, { 'Content-Type': 'application/javascript' });
                }

                response.write(data);
            }

            response.end();
        })

    }

}).listen(1208);

console.log('Server running at http://127.0.0.1:1208/index.html');

function writeJson(params) {
    fs.readFile('./data/article.json', function (err, data) {
        if (err) {
            return console.error(err);
        }

        var person = data.toString();
        person = JSON.parse(person);
        person.article.push(params);

        console.log(person.article);

        var str = JSON.stringify(person);

        fs.writeFile('./data/article.json', str, function (err) {
            if (err) {
                console.error(err);
            }
            console.log('----------新增成功---------');
        })
    })
}
/**
 *
 *  Cloudflare Workers Blog
 *
 *  https://github.com/kasuganosoras/cloudflare-worker-blog
 *
 */

// 定义 Github 项目，文章会从这里读取
const github_base = "brightmann/kcwb";

// 站点名称
const site_name = "CloudFlare Workers Blog";

// 站点介绍
const site_desc = "一个用 CloudFlare Worker 搭建的博客";

// 每页文章数量
const posts_per_page = 5;

// Copyright
const copyright = `&copy; 2019 ${site_name} | <a href="https://github.com/kasuganosoras/cloudflare-worker-blog" target="_blank">Github</a>`;

/* 配置到此结束 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

var header = `
<html>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=11">
		<meta name="application-name" content="${site_name}">
		<meta name="msapplication-TileColor" content="#F1F1F1">
		<meta name="description" content="${site_desc}">
		<link rel="stylesheet" href="https://netdna.bootstrapcdn.com/font-awesome/4.6.0/css/font-awesome.min.css">
		<title>${site_name}</title>
		<script src="https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/showdown/1.9.0/showdown.min.js" type="text/javascript"></script>
		<style type="text/css">/* 内联精简样式，替代原 Bootstrap CDN */*,*:before,*:after{box-sizing:border-box;}body{margin:0;font-size:14px;line-height:1.42857143;color:#333;background-color:#fff;}a{color:#337ab7;text-decoration:none;}a:hover,a:focus{color:#23527c;text-decoration:underline;}h2{font-size:30px;margin:20px 0 10px;font-weight:500;line-height:1.1;}h4{font-size:18px;margin:10px 0;font-weight:500;line-height:1.1;}p{margin:0 0 10px;}ul,ol{margin-top:0;margin-bottom:10px;}hr{margin:20px 0;border:0;border-top:1px solid #eee;}blockquote{padding:10px 20px;margin:0 0 20px;border-left:5px solid #eee;}.container{max-width:970px;margin:0 auto;padding:0 15px;}.row:before,.row:after{display:table;content:" ";}.row:after{clear:both;}.col-sm-2,.col-sm-8{position:relative;min-height:1px;padding:0 15px;width:100%;}@media (min-width:768px){.col-sm-2,.col-sm-8{float:left;}.col-sm-2{width:16.66666667%;}.col-sm-8{width:66.66666667%;}}.text-right{text-align:right;}.text-muted{color:#777;}.pager{padding-left:0;margin:20px 0;text-align:center;list-style:none;}.pager:before,.pager:after{display:table;content:" ";}.pager:after{clear:both;}.pager li{display:inline;}.pager li>a,.pager li>span{display:inline-block;padding:5px 14px;background-color:#fff;border:1px solid #ddd;border-radius:15px;}.pager li>a:hover{text-decoration:none;background-color:#eee;}.pager .next>a,.pager .next>span{float:right;}.pager .previous>a,.pager .previous>span{float:left;}code{padding:2px 4px;font-size:90%;color:#c7254e;background-color:#f9f2f4;border-radius:4px;font-family:Menlo,Monaco,Consolas,"Courier New",monospace;}pre{display:block;padding:9.5px;margin:0 0 10px;font-size:13px;line-height:1.42857143;color:#333;background-color:#f5f5f5;border:1px solid #ccc;border-radius:4px;overflow:auto;font-family:Menlo,Monaco,Consolas,"Courier New",monospace;}pre code{padding:0;font-size:inherit;color:inherit;background-color:transparent;border-radius:0;}.post-a {color: #000;text-decoration: none ! important;}.post-box {padding: 12px 20px 12px 20px;border-bottom: 1px solid rgba(0,0,0,0.07);cursor: pointer;border-left: 0px solid rgba(66, 66, 66, 0);transition-duration: 0.3s;}.post-box:hover {transition-duration: 0.3s;border-left: 5px solid rgba(66, 66, 66, 0.15);}.thread h2 {border-bottom: 1px solid rgb(238,238,238);padding-bottom: 10px;}.editor-preview pre, .editor-preview-side pre{padding: 0.5em;}.hljs{background: unset ! important;padding: 0px;}.CodeMirror{height: calc(100% - 320px);min-height: 360px;}.msgid{font-family:Consolas;}.tooltip {word-break: break-all;}h2 a{font-weight: 400;}body{font-family: '-apple-system','BlinkMacSystemFont','Segoe UI','Helvetica','Arial','sans-serif','Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol' ! important;font-weight: 400;}h2 a{color: #000;} h2 a:hover{color: #000; text-decoration: none;}.full-width{width: 100%;}.thread img{vertical-align:text-bottom ! important;max-width:100% ! important;margin-top:8px;margin-bottom:8px;}.thread table{display:block;width:100%;overflow:auto;margin-bottom:8px;}.thread table tr{background-color:#fff;border-top:1px solid #c6cbd1;}.thread table tr:nth-child(2n){background-color:#f6f8fa;}.thread table th,.thread table td{padding:6px 13px;border:1px solid #dfe2e5;font-size:14px;}.thread pre{margin-bottom:16px;}pre{border:none ! important;}blockquote{font-size:15px ! important;}</style>
	</head>
  <body>
    <div class="container">
      <div class="row">
        <div class="col-sm-2"></div>
        <div class="col-sm-8">
          <h2><a href="/" class="post-a">${site_name}</a></h2>
          <p>${site_desc}</p>
          <hr>
          <div class="thread">
`;

function getRequestParams(str) {
  var index = str.indexOf("?");
  str = str.substring(index + 1, str.length);
  console.log(str);
  if(typeof(str) == "string"){
      u = str.split("&");
      var get = {};
      for(var i in u){
          var j = u[i].split("=");
          get[j[0]] = j[1];
      }
      return get;
  } else {
      return {};
  }
}

async function bloghandle(request) {
  var $_GET = getRequestParams(request.url);
  var data = header;
  if($_GET['p'] == undefined) {
    var url = "https://raw.githubusercontent.com/" + github_base + "/master/list.json";
    const init = {
      method: "GET"
    };
    const response = await fetch(url, init);
    var resptxt = await response.text();
    var json = JSON.parse(resptxt);
    // 按发布时间排序，最新在前
    json.sort(function(a, b) {
      if(a.time < b.time) return 1;
      if(a.time > b.time) return -1;
      return 0;
    });
    // 解析 /page/N 路径，支持分页
    var page = 1;
    try {
      var pathname = new URL(request.url).pathname;
      var pmatch = pathname.match(/^\/page\/(\d+)\/?$/);
      if(pmatch) page = parseInt(pmatch[1], 10);
    } catch(e) {}
    if(isNaN(page) || page < 1) page = 1;
    var totalPosts = json.length;
    var totalPages = Math.max(1, Math.ceil(totalPosts / posts_per_page));
    if(page > totalPages) page = totalPages;
    var pagePosts = json.slice((page - 1) * posts_per_page, page * posts_per_page);
    console.log(json);
    data += `<p>所有文章</p>`;
    for(var i = 0;i < pagePosts.length;i++) {
      try {
        var filename = encodeURIComponent(pagePosts[i].file.replace(/"/g, ""));
        var time = pagePosts[i].time;
        var title = pagePosts[i].title;
        data += `<a href="/?p=${filename}" class="post-a">
						<div class="post-box">
							<h4>${title}</h4>
							<p>发表于 ${time}</p>
						</div>
					</a>`;
      } catch(e) {
        // 收声
      }
    }
    if(totalPosts == 0) {
      data += `<p><blockquote>暂时没有文章！</blockquote></p>`
    }
    if(totalPages > 1) {
      data += `<ul class="pager">`;
      if(page > 1) {
        var prevUrl = (page - 1) == 1 ? "/" : "/page/" + (page - 1);
        data += `<li class="previous"><a href="${prevUrl}">&larr; 上一页</a></li>`;
      }
      data += `<li><span class="text-muted">第 ${page} / ${totalPages} 页</span></li>`;
      if(page < totalPages) {
        data += `<li class="next"><a href="/page/${page + 1}">下一页 &rarr;</a></li>`;
      }
      data += `</ul>`;
    }
    data += `
            <br>
            <p class="text-right">${copyright}</p>
          </div>
    `;
  } else {
    data += `
          </div>
          <script type="text/javascript">
            var textcontent = \`
`;
    var url = "https://raw.githubusercontent.com/" + github_base + "/master/" + $_GET['p'];
    const init = {
      method: "GET"
    };
    const response = await fetch(url, init);
    if(response.status == 200) {
      var resptxt = await response.text();
      data += resptxt.replace(/`/g, "\\`");
    } else {
      data += `
### 404 Not Found
您所访问的文章不存在。      
`;
    }
    data += `
            \`;
          </script>
          <hr>
          <p class="text-right">${copyright}</p>
    `;
  }
  data += `
        </div>
      </div>
    </div>
    <script type="text/javascript">
      if(window.hljs){hljs.initHighlightingOnLoad();}//对 hljs 进行初始化
      var md = new showdown.Converter(); // 引入 showdown
            md.setOption('tables', true); // 启用内置表格支持
      md.setOption('simplifiedAutoLink', true); // 自动识别链接
      md.setOption('simpleLineBreaks', true); // 自动换行
      md.setOption('openLinksInNewWindow', true); // 新标签页打开链接
      window.onload = function() {
        $(".thread").html(md.makeHtml(textcontent));
        document.querySelectorAll('pre code').forEach(function(e) {
          if(window.hljs){hljs.highlightBlock(e);}//渲染代码块，执行高亮操作
        });
      }
    </script>
  </body>
</html>
`;
  return data;
}

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
  var resp = new Response(await bloghandle(request), {"Content-type": "text/html;charset=UTF-8", status: 200});
  resp.headers.set("Content-Type", "text/html");
  return resp;
}

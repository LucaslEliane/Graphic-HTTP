## HTTP/2 服务器推送

HTTP/2随着提案的提出，现在已经添加了许多的新功能：首部压缩，二进制帧，多路复用技术以及非常重要的一个部分：服务器端推送。服务器端推送允许服务器端在客户端没有请求的时候，推送一些没有被客户访问的资源。

### Server Push

当前的网站访问模式一直是请求-响应模式的，用户将请求发送到远程服务器，服务器会响应被请求的内容。

而在web方面，针对服务器的请求一般是首先请求一个HTML文档，当客户端接收到该文档要对其进行渲染的时候，再去请求需要的所有资源，比如样式表、脚本、图片等。

而使用了服务器端推送之后，服务器可以在响应初始页面文档的时候，顺便将其渲染所需要的脚本或者样式表直接推送给客户端，这个功能和HTTP/2中的多路复用结合起来，可以很好地提升用户体验。

### Server Push 解决了什么问题

在HTTP/1.1时代，在书写HTML文档的时候，为了加载更少的外部资源，会经常将图片转换为二进制编码，内嵌到文档中，或者使用内嵌脚本、内嵌CSS来加快页面的渲染速度，因为这时候需要二次请求的外部资源变少了。

但是这样做存在一些问题，比如脚本、样式表不能够被缓存，也就是内联资源虽然提升了第一次加载页面时候的速度，但是却导致了其后的访问速度变慢了。

Server Push可以获取内联资源的首次加载速度以及外联资源的缓存效果，使得资源有了独立地缓存策略，这就是使用Server Push的原因。

### 如何使用 Server Push

使用Server Push的方法主要是将需要推送的资源添加到 HTTP的 Link首部里面。

`Link: </css/styles.css>; rel=preload; as=style`

首部中的`as`属性是必选的，这个属性表示推送的资源类型，如果不进行设置的话，会导致浏览器对推送资源进行了两次下载。

#### 设置Link首部

如何设置Link首部目前有两种方法：其一是在服务器配置文件中设置Link首部，比如Apache或者Nginx等。其二是在后端语言的文件中进行设置。

1. 服务器配置设置Link首部

```
<FileMatch "\.html$">
  Header set Link "</css/styles.css>; rel=preload; as=style"
</FileMatch>
```

当用户请求的文件匹配了`.html`文件的时候，就会向响应头里面加入Link首部，来告知服务器去推送`/css/styles.css`的这个资源。

但是目前Nginx并不支持服务器端推送。

2. 使用后端代码设置Link首部

使用后端服务器语言也可以为HTTP响应设置响应头，以PHP为例：

`header("Link: </css/styles.css>; rel=preload; as=style");`

在无法自由设置服务器的时候，那么使用这个方法可能更适合实现服务器端推送。

#### 多资源推送

很多情况下不仅仅需要推送一个资源，页面中可能有样式表、脚本、图片等多种资源。

针对多个资源的推送，可以设置一个Link头部，然后将每个资源用逗号分开，也可以设置多个Link头部，这两种方法都是符合规范的。

```
Link: </css/styles.css>; rel=preload; as=style, </js/scripts.js>; rel=preload; as=script

<FileMatch "\.html$">
  Header add Link "</css/styles.css>; rel=preload; as=style"
  Header add Link "</js/scripts.js>; rel=preload; as=script"
</FileMatch>
```
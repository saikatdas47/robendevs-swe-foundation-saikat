# Day 2 Browser Internals, Rendering and Web Security

## From a URL to a page

I think of loading a page as a series of jobs. The browser reads the URL, checks whether it can use a saved response, finds the server through DNS when needed, and opens or reuses a connection. For HTTPS, the connection is protected with TLS. The browser then sends an HTTP request and starts reading the response.

This does not mean it waits for every file before doing anything. It can read HTML as it arrives. It finds links to CSS, scripts, images and fonts and starts loading them too. A service worker can also handle a request if one already controls the page.

## HTML and the DOM

I understand the DOM as the browser's tree of the HTML document. Each element becomes a node. Text also becomes a node. The browser reads HTML tokens and builds this tree, following rules that can also repair some invalid HTML.

This tree is what JavaScript reads and changes through methods such as `querySelector` and `createElement`. The DOM can change after the original HTML has loaded. It is not just a copy of the source file.

## CSS and the CSSOM

The browser reads CSS rules and builds the CSSOM. This gives it a way to work with styles. It checks which selectors match an element and uses the cascade, specificity and inheritance to find the final style values.

I keep the DOM and CSSOM separate in my mind. The DOM describes the document. The CSSOM describes the style rules. The browser uses both when deciding what to show.

## Style, layout, paint and compositing

This is the order I use to follow the rendering work.

1. Style calculation finds the styles for each element.
2. Layout finds sizes and positions.
3. Paint records what needs to be drawn, such as text, borders and backgrounds.
4. Raster work turns drawing instructions into pixels.
5. Compositing puts the needed layers together for the screen.

An element with `display: none` does not get a layout box. An element with `visibility: hidden` still takes space, even though its content is hidden. The actual browser uses more internal structures than a simple render tree diagram shows.

I use my [rendering pipeline diagram](rendering-pipeline.md) to connect these steps. My original [handwritten notes](Note.pdf) are also kept in this folder.

## Events and event delegation

An event such as a click has a capture phase, a target phase and usually a bubble phase. Capture travels down the event path toward the target. Bubbling travels back up. Not every event bubbles.

I can listen during capture by passing `{ capture: true }` to `addEventListener`. The usual listener uses the bubble phase. `event.target` tells me where the event started, with some adjustments at shadow DOM boundaries. `event.currentTarget` is the element whose listener is running.

This makes event delegation useful. I put one listener on a parent and check which child was clicked. It can also handle children added later.

```javascript
const list = document.querySelector('#items')

list.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return
  const button = event.target.closest('button[data-id]')
  if (!button || !list.contains(button)) return
  console.log(button.dataset.id)
})
```

`preventDefault()` stops a cancelable default action, such as following a link. `stopPropagation()` stops further travel along the event path. These do different jobs.

## Cookies, localStorage and sessionStorage

I use cookies when the browser needs to send a small value with matching HTTP requests. A common example is a session ID. Cookie scope, expiry and security flags control how it is used.

`localStorage` stores string values for an origin and usually keeps them across browser sessions. `sessionStorage` also stores strings, but it is separated by origin and tab session. It survives a reload and normally ends when that tab session ends.

This storage is different from cookies because the browser does not automatically attach these values to requests. Both storage APIs are synchronous, so large or frequent work can block JavaScript. Browser settings and storage limits can also affect them.

I would not put a secret in localStorage and assume it is safe. JavaScript running on that origin can read it. An XSS bug can expose it. An HttpOnly cookie prevents script from reading that cookie, though XSS can still make requests as the user.

## The critical rendering path

This is the work needed before the browser can show the first useful content. CSS needed for the current page can block rendering until it is loaded and processed. Large CSS files or a chain of CSS imports can delay this step.

A normal classic script without `async` or `defer` pauses HTML parsing while it loads and runs. It can also wait for earlier stylesheets. This is why script placement and loading mode matter.

For an external classic script, `async` downloads while parsing continues and runs when ready. It can interrupt parsing and does not preserve script order. I would use it for an independent script.

`defer` also downloads while parsing continues. It runs after HTML parsing, in document order, before `DOMContentLoaded`. I would use it when a script needs the DOM or depends on another deferred script. Module scripts are deferred by default unless they use `async`. The defer attribute does not make an inline classic script deferred.

I would reduce unused CSS and JavaScript, keep the needed early CSS small, and avoid making important content wait for unnecessary scripts. Loading everything early can create more competition for the same network and CPU.

## Reflow, repaint and layout thrashing

Reflow is another name for layout work. Changing an element's width, font size or content can change its size or position and may affect other elements. A paint change, such as changing a background color, may not need layout.

This becomes expensive when code keeps changing styles and then asking for a fresh size. A read such as `offsetWidth` can force the browser to finish pending layout before returning a value. Repeating that pattern is called layout thrashing.

I would read the needed sizes together and then apply the changes together. I would avoid measuring after every small change. `requestAnimationFrame` helps schedule visual updates before a frame, but it does not make a large loop cheap.

Moving an element with `transform` or changing `opacity` can sometimes use existing layers without new layout or paint. This depends on what the browser has put into layers. I would confirm the result in DevTools instead of assuming every animation is cheap.

## Same origin policy and CORS

An origin is the combination of scheme, host and port. `https://shop.example` and `https://api.example` have different origins. Changing the port or changing HTTPS to HTTP also changes the origin.

The same origin policy limits how a script can access data from another origin. It does not stop every request or every embedded image. CORS lets a server say which other origins may read a response through browser APIs such as fetch.

Some requests need a preflight. For example, a fetch using PUT or an Authorization header will usually cause the browser to send an OPTIONS request first. The server replies with allowed origins, methods and headers. If that check fails, the browser does not send the actual request.

Some requests are sent without a preflight. If the response does not pass the CORS check, the browser prevents the script from reading it. The request may still have changed server state. This is why CORS is not a replacement for CSRF protection or server authentication.

For a fetch that needs cookies across origins, I would check the fetch credentials setting, cookie rules and the server response. A response that permits credentials needs a specific allowed origin and `Access-Control-Allow-Credentials: true`. A wildcard allowed origin cannot be used for that case. Third party cookie rules can still prevent the cookies.

See the [MDN CORS guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS).

## XSS, CSRF and CSP

XSS happens when unwanted script runs as part of a trusted page. For example, putting an untrusted comment into `innerHTML` can create an injection bug. I would use `textContent` for plain text. When HTML input is needed, I would use a suitable sanitizer and handle output safely for the place where it is used.

CSRF tricks the browser into sending an unwanted action using credentials it already has, often cookies. I would protect actions with server checked CSRF tokens, origin checks where suitable and proper cookie settings. GET requests should not perform actions such as deleting an account.

CSP is a response policy that can limit which scripts and other resources a page can use. A strong script policy can use a fresh nonce for each response or approved hashes. This helps reduce the effect of injection, but it does not fix unsafe code by itself. I would try a report only policy before enforcing a new policy on an existing site.

I remember the cookie flags like this. `Secure` sends the cookie only over a secure connection. `HttpOnly` prevents JavaScript from reading it. `SameSite=Lax` or `Strict` limits sending in certain cross site requests. `SameSite=None` permits cross site use and requires `Secure`, but browser cookie restrictions still apply. Same site and same origin are different checks. SameSite alone is not a complete CSRF solution.

See the [MDN web security guides](https://developer.mozilla.org/en-US/docs/Web/Security).

## Reading the Network panel

I would open DevTools before reloading the page. In Network, I can check the status, resource type, size, request headers, response headers and which code started each request. Disabling cache is useful for checking a fresh load. I would also compare with a normal cached load.

This is how I read a waterfall. A bar that starts late may be waiting for another resource or for the browser to schedule it. The Timing view separates queueing, connection setup, time waiting for the first response byte and content download. A reused connection may not need a new DNS lookup or handshake.

A long wait for the first byte can include network travel and server work. It does not prove the server alone is slow. I would also check request dependencies, failed requests, cache use and whether a service worker handled the request.

## Reading the Performance panel

I would record a reload or a slow interaction and inspect the main thread, frames and related events. Long JavaScript tasks, repeated style calculations, layout and paint can explain a page that feels stuck even when requests are fast.

This panel helps connect a delay to the work causing it. I would check a CPU profile for expensive functions and compare before and after one change using similar device and network conditions. These are steps I would follow, not results from a recorded test in this folder.

## Browser processes and the JavaScript engine

A browser uses several processes to keep work separate. The browser process manages things such as windows and navigation. Renderer processes handle page content. Network and GPU work can run in separate processes too. The exact setup depends on the browser and its settings. There is not always exactly one renderer per tab.

I understand the renderer as more than the JavaScript engine. The renderer handles HTML, CSS, layout and other page work. The JavaScript engine, such as V8 in Chrome, runs JavaScript and manages its memory. Much page JavaScript and rendering work share the main thread. A web worker can run some JavaScript elsewhere but cannot directly edit the DOM.

Sandboxing limits what a renderer can access on the computer. It must ask more trusted browser parts to perform restricted work. Separating sites into processes adds another boundary. These controls reduce damage from bugs, but they do not remove the need for safe page code.

See [Inside look at modern web browser](https://developer.chrome.com/blog/inside-browser-part1).

## LCP, INP, CLS and long tasks

LCP means Largest Contentful Paint. It tracks when the largest eligible visible image or text block is painted. I use it to understand how soon the main content appears. A good target is 2.5 seconds or less.

INP means Interaction to Next Paint. It tracks how quickly a page responds visually to interactions such as clicks, taps and key presses. It includes waiting before a handler runs, the handler work and the delay before the next paint. A good target is 200 milliseconds or less.

CLS means Cumulative Layout Shift. It measures unexpected movement of visible content using grouped shifts during the page visit. A good target is 0.1 or less. Reserving image space and avoiding late content above existing text can help.

These targets are assessed at the 75th percentile of page visits. One good local recording does not prove that real users have a good experience.

A long task takes more than 50 milliseconds on the main thread. During that time, other main thread work may have to wait. I would split large jobs, reduce unnecessary JavaScript and consider workers for suitable heavy calculations. A busy chain of microtasks can also delay rendering.

See [Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds).

## Service workers and offline storage

A service worker is a script the browser can run separately from a page. It can handle fetch events for pages within its control and return saved responses when the network is unavailable. It needs a secure context, with localhost allowed for development.

Installing a worker does not automatically make the current page work offline. It must activate and control the page, and the code must save the needed resources and choose how to handle requests. It has no direct DOM access and the browser can stop it when idle.

Cache Storage stores Request and Response pairs. It is separate from the normal HTTP cache. I would use it for chosen page resources and decide when to refresh or remove old entries. Cache Storage does not automatically remove a saved response just because its HTTP freshness time has passed.

IndexedDB stores larger structured data through an asynchronous API. It can hold offline records or pending edits. localStorage is much simpler and synchronous. None of these should be treated as unlimited permanent storage. Quotas, clearing and eviction can remove data.

This also needs care with private data. I would avoid saving private API responses in a shared offline cache and clear user data when appropriate. An offline page cannot complete a server action without a connection. Sending saved actions later needs retry and conflict handling.

See [Using service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).

## GPU compositing and cross origin isolation

The browser can put some page content into separate layers and use the GPU to help draw and combine them. This can make scrolling and some animations smoother. Extra layers also use memory, so I would not add `will-change` to every element. It is a hint for a specific need, not a general speed fix.

Cross origin isolation adds stronger separation around a page and resources it loads. A common setup uses these response headers.

```http
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

This setup changes how the page can share a browsing context with other pages and requires suitable permission for resources from other origins. Some existing images, scripts or popup flows may stop working until they meet the rules. It also requires a secure context and can depend on permissions policy. I would check `window.crossOriginIsolated` to see the result.

It can enable features such as SharedArrayBuffer in supported browsers. This is a security boundary, not an automatic rendering speed improvement. It also does not replace CORS, CSP or safe handling of user input.

See the [COOP guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Opener-Policy) and [COEP guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Embedder-Policy).

## Why fast requests can still leave a slow page

I separate receiving files from using them. A server might return HTML in 100 milliseconds, but the browser still needs to parse it, build the DOM and CSSOM, run scripts, calculate layout and draw the result.

This means a page can finish its requests and still feel frozen. For example, a script might spend 700 milliseconds building thousands of elements after a fast response. A click during that work has to wait if the main thread is busy. Large images can also need decoding work after download. Repeated layout reads and writes can add more delay before a new frame appears.

I would check both Network and Performance. Network shows when the data arrives. Performance shows what the browser does with it. Reducing script work, breaking up long jobs, keeping the DOM smaller and avoiding repeated layout can improve response to input even when request times stay the same.

This is an example explanation. I have not measured the example timings on a real page here.

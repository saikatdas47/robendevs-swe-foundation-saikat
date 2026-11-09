# Rendering pipeline

I am keeping my original PNG diagram from the Day 1 and 2 folder.

![My rendering pipeline diagram](Diagram%202%20rendering-pipeline.png)

I read the stages in this order.

```text
HTML → parsing → DOM         CSS → parsing → CSSOM
                   ↘         ↙
                  Style calculation
                          ↓
                        Layout
                          ↓
                         Paint
                          ↓
                   Raster into pixels
                          ↓
                     Compositing
                          ↓
                        Screen
```

This is a simple view of the process. The browser can load and parse resources while other work is happening. JavaScript can change the DOM and styles, which may make the browser repeat some steps. Not every change needs a full layout or repaint.

I use layout to find sizes and positions. Paint records drawing work. Raster creates the pixels. Compositing combines the layers. The GPU can help with some of this work, but JavaScript and layout can still keep the main thread busy.

This explains why a fast download is only part of a fast page. The browser also needs time to turn the response into a frame and react to input.

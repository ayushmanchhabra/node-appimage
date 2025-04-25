# appimage

A Node.js implementation of the packaging executables as AppImage.

## Getting Started

```js
import createAppImAge from 'appimage'; 

await createAppImAge({
    appName: 'Demo',
    outDir: './test',
    srcMap: [
        { './test/AppRun': '/AppRun' },
        { './test/demo.desktop': '/demo.desktop' },
        { './test/demo': '/usr/bin/demo' },
        { './test/demo.png' : '/demo.png' },
    ],
});
```

## Contributing

## LICENSE

MIT

# Quickstart

Isomorphic package for React+Express projects

Implements simple GitHub auth based app.

## Installation
```bash
npm i @diplodoc/quickstart
```

## Usage

Attach routing to server
```js
import {route as quickstart} from '@diplodoc/quickstart'

express.use(quickstart(
    staticRoot: 'some/static/root'
));
```

Publish static to CDN
```bash
s3cmd sync ./node_modules/@diplodoc/quickstart s3:/some/static/root
```

## DEv Requirements

- node >= 18
- haproxy (would be autoinstalle in [haproxy/start](proxy/start) script)

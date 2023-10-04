# Quickstart

Isomorphic package for React+Express projects

Implements simple GitHub auth based app.

## Installation
```bash
npm i @diplodoc/www-quickstart
```

## Usage

Attach routing to server
```js
import {router as quickstart} from '@diplodoc/www-quickstart'

express.use(quickstart);
```

Publish static to CDN
```bash
s3cmd sync ./node_modules/@diplodoc/quickstart s3:/some/static/root
```

## DEv Requirements

- node >= 18
- haproxy (would be autoinstalle in [haproxy/start](proxy/start) script)

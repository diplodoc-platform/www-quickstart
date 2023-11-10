import React from 'react';
import {stringify} from "~/utils";
import * as urls from "~/configs/urls";
import * as env from "~/configs/env";
import * as manifest from "~/configs/manifest";
import * as navigation from "~/configs/navigation";
import * as user from "~/configs/user";
import * as common from "~/configs/common";
import {GTMHead} from "../Gtm/GTMHead";
import Favicon from "../Favicon";
import { Transferable } from '../../components/Transferable';


export const Head = () => {
    return (
       <head>
           <meta charSet="utf-8"/>
           <meta name="viewport" content="width=device-width, initial-scale=1"/>
           <title>Diplodoc quickstart</title>
           <Favicon assetsPath={urls.assetsPath} />
           <Transferable id="config-env" data={ stringify({ ...env, isServer: true }) }/>
           <Transferable id="config-manifest" data={ stringify(manifest) }/>
           <Transferable id="config-navigation" data={ stringify(navigation) }/>
           <Transferable id="config-user" data={ stringify(user) }/>
           <Transferable id="config-urls" data={ stringify(urls) }/>
           <Transferable id="config-common" data={ stringify(common) }/>
           {
               manifest.styles.map((style) => (
                   <link key={ style } rel="stylesheet"
                         href={ urls.base && !style.startsWith('http') ? urls.base + style : style }/>
               ))
           }
           {common.gtmId && <GTMHead id={common.gtmId} nonce={common.nonce} />}
       </head>
    )
}
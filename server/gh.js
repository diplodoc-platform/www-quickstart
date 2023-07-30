import {readFileSync} from "fs";
import {App} from "octokit";

export default (id, key) => {
    const app = new App({
        appId: id,
        privateKey: readFileSync(key),
    });

    return app;
}
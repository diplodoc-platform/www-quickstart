import envconfig from "./envconfig.js";

const ENV = {
    saId: envconfig.expectEnv('SA_ID')(),
    saAccessKey: envconfig.expectEnv('SA_ACCESS_ID')(),
    saPrivateKey: envconfig.expectEnv('SA_PRIVATE_KEY')().replace(/\\n/g, '\n'),
    saSupervisorId: envconfig.expectEnv('STORAGE_SUPERVISOR_SA')('ajeqk7ra0h8ni9jascao'),
    saResourceId: envconfig.expectEnv('FOLDER_ID')('b1g1j115gl75k4sqiu0m'),
    navigationEndpoint: envconfig.expectEnv('NAVIGATION_ENDPOINT')()
};

export default (req, customFetch = null) => ({
    api: {
        request: req.ctx.request.bind(req.ctx)
    },
    env: {
        isServer: true,
        isMobile: true,
    },
    server: {
        ...req.session,
        ...ENV,
        ...(customFetch ? {fetch: customFetch} : {})
    }
});

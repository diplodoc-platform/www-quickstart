if (typeof __webpack_require__ === 'undefined') {
    throw new Error('Unexpected environment');
}

const state: Record<string, any> = __webpack_require__.__STATE__.session;

export const accessToken: string = state.access_token;
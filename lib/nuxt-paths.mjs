import { joinRelativeURL } from 'ufo'

const appConfig = {
    baseURL: '/',
    buildAssetsDir: '/_nuxt/',
    cdnURL: '',
}

export const baseURL = () => appConfig.baseURL
export const buildAssetsDir = () => appConfig.buildAssetsDir
export const buildAssetsURL = (...path) => joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path)
export const publicAssetsURL = (...path) => {
    const publicBase = appConfig.cdnURL || appConfig.baseURL
    return path.length ? joinRelativeURL(publicBase, ...path) : publicBase
}

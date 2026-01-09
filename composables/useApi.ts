export const useApi = () => {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase as string

    const fetchApi = async (endpoint: string, options: any = {}) => {
        const url = `${apiBase}${endpoint}`

        try {
            const response = await $fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            })
            return response
        } catch (error) {
            console.error('API Error:', error)
            throw error
        }
    }

    return {
        fetchApi,
        apiBase
    }
}

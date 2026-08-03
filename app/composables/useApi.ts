export function useApi() {
  const config = useRuntimeConfig()
  const baseUrl = computed(() => (config.public.apiUrl as string).replace(/\/$/, ''))

  function url(path: string): string {
    return `${baseUrl.value}${path.startsWith('/') ? path : `/${path}`}`
  }

  async function get<T>(path: string): Promise<T> {
    return $fetch<T>(url(path))
  }

  async function post<T>(path: string, body: unknown): Promise<T> {
    return $fetch<T>(url(path), { method: 'POST', body })
  }

  async function put<T>(path: string, body: unknown): Promise<T> {
    return $fetch<T>(url(path), { method: 'PUT', body })
  }

  async function del<T>(path: string): Promise<T> {
    return $fetch<T>(url(path), { method: 'DELETE' })
  }

  /** Envoie la photo à l'API qui la transfère vers R2 (pas de CORS R2 côté navigateur). */
  async function uploadPhoto(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('photo', file)

    const result = await $fetch<{ publicUrl: string }>(url('/upload'), {
      method: 'POST',
      body: formData,
    })

    return result.publicUrl
  }

  return { baseUrl, url, get, post, put, del, uploadPhoto }
}

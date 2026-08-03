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

  async function uploadPhoto(file: File): Promise<string> {
    const { uploadUrl, publicUrl } = await post<{ uploadUrl: string; publicUrl: string }>(
      '/upload/presign',
      { fileName: file.name, fileType: file.type },
    )
    await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    })
    return publicUrl
  }

  return { baseUrl, url, get, post, put, del, uploadPhoto }
}

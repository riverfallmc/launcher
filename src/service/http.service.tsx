export class HttpService {
  static async post<T extends Object>(url: string, body?: Object, authorization?: string): Promise<Awaited<T>> {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${authorization}`
      },
      body: body ? JSON.stringify(body) : undefined
    });

    return response.json();
  }
}
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const apiClient = {
  async get(path: string) {
    const res = await fetch(`${API_URL}${path}`);
    return res.json();
  },

  async post(path: string, data: any) {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async patch(path: string, data: any) {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async delete(path: string) {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'DELETE',
    });
    return res.json();
  },
};

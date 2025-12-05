export function getStatusCode(): number {
  // Simulates an API that might return different success codes
  const codes = [200, 201, 204];
  return codes[Math.floor(Math.random() * codes.length)];
}

export function getUserAge(userId: string): number {
  // Mock user ages
  const ages: Record<string, number> = {
    'user1': 25,
    'user2': 30,
    'user3': 18
  };
  return ages[userId] || 0;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getResponse(): { status: number; data: any } {
  return {
    status: 200,
    data: { message: 'Success' }
  };
}

export function mockApiCall(): Promise<number> {
  // This would normally call an API, but we'll force it in tests
  return Promise.resolve(Math.random() * 100);
}

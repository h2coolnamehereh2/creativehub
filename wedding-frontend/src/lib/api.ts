// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Photo type
export interface Photo {
  id: number;
  url: string;
  alt_text?: string;
}

// Date availability type
export interface DateInfo {
  bookedDates: string[];
  lastAvailableDates: string[];
}

// Contact form data
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  wedding_date?: string;
  message?: string;
}

// Fetch photos from API
export async function fetchPhotos(): Promise<Photo[]> {
  try {
    const response = await fetch(`${API_URL}/api/photos`);
    if (!response.ok) throw new Error('Failed to fetch photos');
    const data = await response.json();
    return data.map((photo: Photo) => ({
      ...photo,
      url: photo.url.startsWith('http') ? photo.url : `${API_URL}${photo.url}`,
    }));
  } catch (error) {
    console.error('Error fetching photos:', error);
    return getDefaultPhotos();
  }
}

// Fetch date availability from API
export async function fetchDates(): Promise<DateInfo> {
  try {
    const response = await fetch(`${API_URL}/api/dates`);
    if (!response.ok) throw new Error('Failed to fetch dates');
    return await response.json();
  } catch (error) {
    console.error('Error fetching dates:', error);
    return { bookedDates: [], lastAvailableDates: [] };
  }
}

// Submit contact form
export async function submitContact(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit');
    }

    return { success: true, message: 'Съобщението е изпратено успешно!' };
  } catch (error) {
    console.error('Error submitting contact:', error);
    return { success: false, message: 'Възникна грешка. Моля, опитайте отново.' };
  }
}

// Default photos as fallback
function getDefaultPhotos(): Photo[] {
  return [
    { id: 1, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', alt_text: 'Wedding' },
    { id: 2, url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', alt_text: 'Wedding' },
    { id: 3, url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800', alt_text: 'Wedding' },
    { id: 4, url: 'https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?w=800', alt_text: 'Wedding' },
    { id: 5, url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800', alt_text: 'Wedding' },
    { id: 6, url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800', alt_text: 'Wedding' },
  ];
}

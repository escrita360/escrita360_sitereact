import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card.jsx';

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      // Assuming the backend is running on localhost:8000
      const response = await fetch('http://localhost:8000/api/v1/banners/');
      if (!response.ok) {
        throw new Error('Failed to fetch banners');
      }
      const data = await response.json();
      setBanners(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading banners: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {banners.map((banner) => (
        <Card key={banner.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              {banner.image_url && (
                <img
                  src={banner.image_url.startsWith('http') ? banner.image_url : `http://localhost:8000${banner.image_url}`}
                  alt={banner.alt_text || banner.title}
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-3xl font-bold mb-2">{banner.title}</h2>
                  {banner.highlight && (
                    <p className="text-xl mb-2">{banner.highlight}</p>
                  )}
                  {banner.subtitle && (
                    <p className="text-lg mb-4">{banner.subtitle}</p>
                  )}
                  {banner.button_text && banner.button_link && (
                    <a
                      href={banner.button_link}
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      {banner.button_text}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Banner;
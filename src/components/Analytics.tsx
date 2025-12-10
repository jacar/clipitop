import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, MousePointerClick, Eye, X } from 'lucide-react';
import { getProfileAnalytics } from '../lib/supabase-functions';

interface AnalyticsProps {
  profileId: string;
  onClose: () => void;
}

export function Analytics({ profileId, onClose }: AnalyticsProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    loadAnalytics();
  }, [profileId, days]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await getProfileAnalytics(profileId, days);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-4xl w-full">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando analíticas...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalClicks = analytics?.linkClicks.reduce((acc: number, link: any) => acc + link.clicks_count, 0) || 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-purple-600" size={32} />
            <div>
              <h2 className="text-2xl">Analíticas</h2>
              <p className="text-gray-600 text-sm">Estadísticas de tu perfil</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setDays(7)}
            className={`px-4 py-2 rounded-lg transition ${
              days === 7 ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            7 días
          </button>
          <button
            onClick={() => setDays(30)}
            className={`px-4 py-2 rounded-lg transition ${
              days === 30 ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            30 días
          </button>
          <button
            onClick={() => setDays(90)}
            className={`px-4 py-2 rounded-lg transition ${
              days === 90 ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            90 días
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Eye className="text-purple-600" size={24} />
              <TrendingUp className="text-purple-600" size={20} />
            </div>
            <p className="text-3xl mb-1">{analytics?.totalViews || 0}</p>
            <p className="text-sm text-gray-600">Vistas totales</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <MousePointerClick className="text-blue-600" size={24} />
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <p className="text-3xl mb-1">{totalClicks}</p>
            <p className="text-sm text-gray-600">Clicks totales</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="text-green-600" size={24} />
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <p className="text-3xl mb-1">{analytics?.recentViews || 0}</p>
            <p className="text-sm text-gray-600">Vistas ({days} días)</p>
          </div>
        </div>

        {/* Link Performance */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="text-lg mb-4">Rendimiento de Enlaces</h3>
          <div className="space-y-3">
            {analytics?.linkClicks.length > 0 ? (
              analytics.linkClicks.map((link: any) => {
                const percentage = totalClicks > 0 ? (link.clicks_count / totalClicks) * 100 : 0;
                return (
                  <div key={link.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{link.title}</span>
                      <span className="text-sm">{link.clicks_count} clicks</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-400 py-4">
                No hay datos de clicks aún
              </p>
            )}
          </div>
        </div>

        {/* Views Chart */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg mb-4">Vistas por Día</h3>
          <div className="space-y-2">
            {Object.entries(analytics?.viewsByDay || {}).length > 0 ? (
              Object.entries(analytics.viewsByDay)
                .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
                .slice(-10)
                .map(([date, views]: [string, any]) => {
                  const maxViews = Math.max(...Object.values(analytics.viewsByDay));
                  const percentage = (views / maxViews) * 100;
                  return (
                    <div key={date}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{date}</span>
                        <span className="text-sm">{views} vistas</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
            ) : (
              <p className="text-center text-gray-400 py-4">
                No hay datos de vistas aún
              </p>
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

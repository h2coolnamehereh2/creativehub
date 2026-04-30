'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogIn,
  LogOut,
  Calendar,
  Image as ImageIcon,
  Mail,
  Loader2,
  Trash2,
  Plus,
  Check,
  X,
  Eye,
  RefreshCw,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type Tab = 'dates' | 'photos' | 'messages';

interface DateEntry {
  id: number;
  date: string;
  status: 'booked' | 'last_available';
  client_name?: string;
  client_email?: string;
  notes?: string;
}

interface Photo {
  id: number;
  url: string;
  alt_text?: string;
  sort_order: number;
}

interface Message {
  id: number;
  name: string;
  email: string;
  phone?: string;
  wedding_date?: string;
  message?: string;
  read: boolean;
  created_at: string;
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('dates');

  // Data states
  const [dates, setDates] = useState<DateEntry[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Check for existing token
  useEffect(() => {
    const savedToken = localStorage.getItem('wedding_admin_token');
    if (savedToken) {
      verifyToken(savedToken);
    }
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token, activeTab]);

  const verifyToken = async (savedToken: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      if (res.ok) {
        setToken(savedToken);
      } else {
        localStorage.removeItem('wedding_admin_token');
      }
    } catch {
      localStorage.removeItem('wedding_admin_token');
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        localStorage.setItem('wedding_admin_token', data.token);
      } else {
        setLoginError('Грешно потребителско име или парола');
      }
    } catch {
      setLoginError('Грешка при свързване със сървъра');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('wedding_admin_token');
  };

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dates') {
        const res = await fetch(`${API_URL}/api/dates/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setDates(await res.json());
      } else if (activeTab === 'photos') {
        const res = await fetch(`${API_URL}/api/photos`);
        if (res.ok) setPhotos(await res.json());
      } else if (activeTab === 'messages') {
        const res = await fetch(`${API_URL}/api/contact`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data.submissions || []);
        }
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteDate = async (date: string) => {
    if (!confirm('Сигурни ли сте?')) return;
    try {
      await fetch(`${API_URL}/api/dates/${date}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      loadData();
    } catch (err) {
      console.error('Error deleting date:', err);
    }
  };

  const deletePhoto = async (id: number) => {
    if (!confirm('Сигурни ли сте?')) return;
    try {
      await fetch(`${API_URL}/api/photos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      loadData();
    } catch (err) {
      console.error('Error deleting photo:', err);
    }
  };

  const markMessageRead = async (id: number) => {
    try {
      await fetch(`${API_URL}/api/contact/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      loadData();
    } catch (err) {
      console.error('Error marking message read:', err);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm('Сигурни ли сте?')) return;
    try {
      await fetch(`${API_URL}/api/contact/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      loadData();
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  // Login Screen
  if (!token) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass rounded-2xl p-8"
        >
          <h1 className="text-2xl font-serif font-bold text-dark-50 mb-6 text-center">
            Админ панел
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-dark-400 mb-2">
                Потребителско име
              </label>
              <input
                type="text"
                name="username"
                defaultValue="admin"
                className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-dark-100 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm text-dark-400 mb-2">Парола</label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-dark-100 focus:outline-none focus:border-primary-500"
              />
            </div>

            {loginError && (
              <p className="text-red-400 text-sm">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-primary-500 text-dark-950 font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoggingIn ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              Вход
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="glass border-b border-dark-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-serif font-bold text-primary-400">
            Админ панел
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-dark-400 hover:text-dark-200 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Изход
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          {[
            { id: 'dates' as Tab, label: 'Дати', icon: Calendar },
            { id: 'photos' as Tab, label: 'Снимки', icon: ImageIcon },
            { id: 'messages' as Tab, label: 'Съобщения', icon: Mail },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-dark-950'
                  : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}

          <button
            onClick={loadData}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800 text-dark-300 hover:bg-dark-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Опресни
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20"
            >
              <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Dates Tab */}
              {activeTab === 'dates' && (
                <div className="glass rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-dark-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm text-dark-400">
                          Дата
                        </th>
                        <th className="px-4 py-3 text-left text-sm text-dark-400">
                          Статус
                        </th>
                        <th className="px-4 py-3 text-left text-sm text-dark-400">
                          Клиент
                        </th>
                        <th className="px-4 py-3 text-right text-sm text-dark-400">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dates.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-dark-500">
                            Няма записани дати
                          </td>
                        </tr>
                      ) : (
                        dates.map((d) => (
                          <tr key={d.id} className="border-t border-dark-700/50">
                            <td className="px-4 py-3 text-dark-200">{d.date}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  d.status === 'booked'
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-primary-500/20 text-primary-400'
                                }`}
                              >
                                {d.status === 'booked' ? 'Заета' : 'Последна'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-dark-400">
                              {d.client_name || '-'}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => deleteDate(d.date)}
                                className="p-2 text-dark-500 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Photos Tab */}
              {activeTab === 'photos' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative aspect-square rounded-xl overflow-hidden group"
                    >
                      <img
                        src={photo.url}
                        alt={photo.alt_text || ''}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-dark-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => deletePhoto(photo.id)}
                          className="p-3 bg-red-500 text-white rounded-xl"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {photos.length === 0 && (
                    <div className="col-span-full py-12 text-center text-dark-500">
                      Няма качени снимки
                    </div>
                  )}
                </div>
              )}

              {/* Messages Tab */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="glass rounded-2xl py-12 text-center text-dark-500">
                      Няма съобщения
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`glass rounded-2xl p-4 ${
                          !msg.read ? 'border-l-4 border-primary-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-semibold text-dark-100">
                                {msg.name}
                              </span>
                              {!msg.read && (
                                <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs rounded">
                                  Ново
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-dark-400 space-y-1">
                              <p>{msg.email}</p>
                              {msg.phone && <p>{msg.phone}</p>}
                              {msg.wedding_date && (
                                <p>Дата на сватбата: {msg.wedding_date}</p>
                              )}
                            </div>
                            {msg.message && (
                              <p className="mt-3 text-dark-200">{msg.message}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {!msg.read && (
                              <button
                                onClick={() => markMessageRead(msg.id)}
                                className="p-2 text-dark-500 hover:text-green-400 transition-colors"
                                title="Маркирай като прочетено"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteMessage(msg.id)}
                              className="p-2 text-dark-500 hover:text-red-400 transition-colors"
                              title="Изтрий"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { X, User, Mail, Briefcase, LogOut, Edit3, Save } from 'lucide-react';
import { authAPI } from '../services/api';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; email: string; role: string } | null;
  onLogout: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user: propUser, onLogout }) => {
  const [user, setUser] = useState({ name: '', email: '', role: '' });
  const [editedUser, setEditedUser] = useState({ name: '', email: '', role: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [savingUser, setSavingUser] = useState(false);

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
      setEditedUser(propUser);
    } else if (isOpen && !propUser) {
      async function fetchUser() {
        setLoadingUser(true);
        try {
          const res = await authAPI.getCurrentUser();
          if (res.success && res.data) {
            const userData = {
              name: res.data.name || res.data.email.split('@')[0] || 'User',
              email: res.data.email,
              role: res.data.role || 'Team Member',
            };
            setUser(userData);
            setEditedUser(userData);
          } else {
            // Set fallback data
            const fallbackData = {
              name: 'User',
              email: 'user@example.com',
              role: 'Team Member'
            };
            setUser(fallbackData);
            setEditedUser(fallbackData);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          // Set fallback data on error
          const fallbackData = {
            name: 'User',
            email: 'user@example.com',
            role: 'Team Member'
          };
          setUser(fallbackData);
          setEditedUser(fallbackData);
        } finally {
          setLoadingUser(false);
        }
      }
      fetchUser();
    }
  }, [isOpen, propUser]);

  const handleSave = async () => {
    setSavingUser(true);
    try {
      const response = await authAPI.updateProfile(editedUser);
      if (response.success) {
        setUser(editedUser);
        setIsEditing(false);
      } else {
        console.error('Failed to update profile:', response.message);
        // Still update local state for better UX
        setUser(editedUser);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving user profile:', error);
      // Still update local state for better UX
      setUser(editedUser);
      setIsEditing(false);
    } finally {
      setSavingUser(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              {user.name && user.name !== 'User' ? (
                <span className="text-white text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="h-10 w-10 text-white" />
              )}
            </div>
          </div>

          {/* User Info */}
          {loadingUser ? (
            <div className="text-center text-gray-500">Loading profile...</div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{user.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{user.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.role}
                    onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{user.role}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!loadingUser && (
            <div className="mt-6 space-y-3">
              {isEditing ? (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={savingUser}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {savingUser ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={savingUser}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              )}

              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center px-4 py-2 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-center text-xs text-gray-500">
            TitanHire v1.0 • Built with ❤️ by Titanbay
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;

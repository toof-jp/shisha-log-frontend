import { useState } from 'react';
import { Link } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Key, Trash2, Shield } from 'lucide-react';
import { apiClient } from '~/lib/api-client';
import type { MetaFunction } from 'react-router';
import { format } from 'date-fns';

export const meta: MetaFunction = () => {
  return [
    { title: 'Manage Passkeys - Shisha Log' },
    { name: 'description', content: 'Manage your passkeys and devices' },
  ];
};

interface Credential {
  id: string;
  name: string;
  created_at: string;
  last_used_at?: string;
}

function useCredentials() {
  return useQuery({
    queryKey: ['credentials'],
    queryFn: async () => {
      const { data } = await apiClient.get<Credential[]>('/auth/credentials');
      return data;
    },
  });
}

function useDeleteCredential() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/auth/credentials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
    },
  });
}

export default function Credentials() {
  const { data: credentials, isLoading, error } = useCredentials();
  const deleteCredential = useDeleteCredential();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove the passkey "${name}"? You won't be able to sign in from this device anymore.`)) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteCredential.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete credential:', error);
      alert('Failed to delete passkey. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg">Loading passkeys...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg text-red-600">Failed to load passkeys</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to="/profile"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Profile
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Shield className="h-6 w-6 mr-2" />
            Manage Passkeys
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View and manage the passkeys registered to your account. Each passkey is tied to a specific device.
          </p>
        </div>

        {!credentials || credentials.length === 0 ? (
          <div className="text-center py-12">
            <Key className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              No passkeys found. This shouldn't happen if you're logged in.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {credentials.map((credential) => (
              <div
                key={credential.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center">
                    <Key className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {credential.name}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Created: {format(new Date(credential.created_at), 'MMM d, yyyy h:mm a')}
                  </p>
                  {credential.last_used_at && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Last used: {format(new Date(credential.last_used_at), 'MMM d, yyyy h:mm a')}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(credential.id, credential.name)}
                  disabled={deletingId === credential.id || credentials.length === 1}
                  className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-red-400 dark:border-red-600 dark:hover:bg-gray-600"
                  title={credentials.length === 1 ? "You can't delete your only passkey" : "Delete this passkey"}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  {deletingId === credential.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200">Tips:</h4>
          <ul className="mt-2 text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Each passkey is tied to the device where it was created</li>
            <li>• You can have multiple passkeys across different devices</li>
            <li>• Deleting a passkey will prevent sign-in from that device</li>
            <li>• To add a new device, sign out and register a new passkey on that device</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
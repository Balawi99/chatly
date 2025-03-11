import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { getConversations } from '../api/chats';

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await getConversations();
        setConversations(response.data.conversations || []);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Conversations</h1>
        <p className="text-gray-600">Manage and respond to your chat conversations.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-6">
          <p>{error}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {conversations.length === 0 ? (
            <div className="p-6 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                ></path>
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No conversations yet</h3>
              <p className="mt-1 text-gray-500">
                Once visitors start chatting with your widget, conversations will appear here.
              </p>
              <div className="mt-6">
                <Link
                  to="/widgets"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Manage Widgets
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex h-[calc(100vh-220px)]">
              {/* Conversation List */}
              <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
                <ul className="divide-y divide-gray-200">
                  {conversations.map((conversation) => (
                    <li
                      key={conversation.id}
                      className={`cursor-pointer hover:bg-gray-50 ${
                        selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {conversation.widget?.name || 'Unknown Widget'}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {conversation.messages?.length || 0} messages
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {conversation.visitorId ? `Visitor: ${conversation.visitorId.substring(0, 8)}...` : 'Anonymous Visitor'}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <svg
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              ></path>
                            </svg>
                            <p>{formatDate(conversation.updatedAt)}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Conversation Detail */}
              <div className="w-2/3 flex flex-col">
                {selectedConversation ? (
                  <>
                    <div className="border-b border-gray-200 px-6 py-4">
                      <h2 className="text-lg font-medium text-gray-900">
                        {selectedConversation.widget?.name || 'Unknown Widget'}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Started on {formatDate(selectedConversation.createdAt)}
                      </p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                      {selectedConversation.messages?.length > 0 ? (
                        <div className="space-y-4">
                          {selectedConversation.messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.isFromVisitor ? 'justify-start' : 'justify-end'}`}
                            >
                              <div
                                className={`max-w-md rounded-lg px-4 py-2 ${
                                  message.isFromVisitor
                                    ? 'bg-gray-100 text-gray-800'
                                    : message.isAiGenerated
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                <p>{message.content}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDate(message.createdAt)}
                                  {message.isAiGenerated && ' • AI Generated'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">No messages in this conversation.</div>
                      )}
                    </div>
                    <div className="border-t border-gray-200 px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Reply
                        </button>
                        <button
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                          Generate AI Response
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Select a conversation to view details
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Conversations; 
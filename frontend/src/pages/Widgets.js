import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import ChatWidget from '../components/ChatWidget/ChatWidget';
import { getWidgets, createWidget, updateWidget, deleteWidget } from '../api/widgets';

const Widgets = () => {
  const [widgets, setWidgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWidget, setCurrentWidget] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
    position: 'right',
    welcomeMessage: 'Hello! How can I help you today?'
  });
  const [previewWidget, setPreviewWidget] = useState(null);

  useEffect(() => {
    fetchWidgets();
  }, []);

  const fetchWidgets = async () => {
    try {
      setLoading(true);
      const response = await getWidgets();
      setWidgets(response.data.widgets || []);
    } catch (err) {
      console.error('Error fetching widgets:', err);
      setError('Failed to load widgets. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const openModal = (widget = null) => {
    if (widget) {
      setCurrentWidget(widget);
      setFormData({
        name: widget.name,
        color: widget.color,
        position: widget.position,
        welcomeMessage: widget.welcomeMessage
      });
    } else {
      setCurrentWidget(null);
      setFormData({
        name: '',
        color: '#3B82F6',
        position: 'right',
        welcomeMessage: 'Hello! How can I help you today?'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentWidget(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentWidget) {
        // Update existing widget
        await updateWidget(currentWidget.id, formData);
      } else {
        // Create new widget
        await createWidget(formData);
      }
      closeModal();
      fetchWidgets();
    } catch (err) {
      console.error('Error saving widget:', err);
      setError('Failed to save widget. Please try again.');
    }
  };

  const handleDelete = async (widgetId) => {
    if (window.confirm('Are you sure you want to delete this widget?')) {
      try {
        await deleteWidget(widgetId);
        fetchWidgets();
      } catch (err) {
        console.error('Error deleting widget:', err);
        setError('Failed to delete widget. Please try again.');
      }
    }
  };

  const getEmbedCode = (widgetId) => {
    return `<script>
  (function(w, d, s, o, f, js, fjs) {
    w['Chatly-Widget'] = o;
    w[o] = w[o] || function() {
      (w[o].q = w[o].q || []).push(arguments);
    };
    js = d.createElement(s);
    fjs = d.getElementsByTagName(s)[0];
    js.id = o;
    js.src = f;
    js.async = 1;
    fjs.parentNode.insertBefore(js, fjs);
  }(window, document, 'script', 'chatly', 'https://chatly-frontend.vercel.app/widget.js'));
  chatly('init', { widgetId: '${widgetId}' });
</script>`;
  };

  const copyEmbedCode = (widgetId) => {
    const code = getEmbedCode(widgetId);
    navigator.clipboard.writeText(code);
    alert('Embed code copied to clipboard!');
  };

  const showWidgetPreview = (widget) => {
    setPreviewWidget(widget);
  };

  const renderWidgetCard = (widget) => (
    <div key={widget.id} className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200" style={{ backgroundColor: widget.color }}>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">{widget.name}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => openModal(widget)}
              className="p-1 rounded-full text-white hover:bg-white hover:bg-opacity-20"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => handleDelete(widget.id)}
              className="p-1 rounded-full text-white hover:bg-white hover:bg-opacity-20"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="px-6 py-4">
        <div className="mb-4">
          <p className="text-sm text-gray-500">Welcome Message:</p>
          <p className="text-gray-700">{widget.welcomeMessage}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-500">Position:</p>
          <p className="text-gray-700 capitalize">{widget.position}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-500">Created:</p>
          <p className="text-gray-700">{new Date(widget.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
        <button
          onClick={() => showWidgetPreview(widget)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg className="mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview
        </button>
        <button
          onClick={() => copyEmbedCode(widget.id)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg className="mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copy Code
        </button>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Widgets</h1>
          <p className="text-gray-600">Manage your chat widgets and get embed codes.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Create Widget
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-6">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {widgets.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow p-6 text-center">
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
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                ></path>
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No widgets yet</h3>
              <p className="mt-1 text-gray-500">Create your first widget to start chatting with your website visitors.</p>
              <div className="mt-6">
                <button
                  onClick={() => openModal()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create Widget
                </button>
              </div>
            </div>
          ) : (
            widgets.map(renderWidgetCard)
          )}
        </div>
      )}

      {/* Widget Preview */}
      {previewWidget && (
        <ChatWidget
          widgetId={previewWidget.id}
          position={previewWidget.position}
          color={previewWidget.color}
          welcomeMessage={previewWidget.welcomeMessage}
        />
      )}

      {/* Modal for creating/editing widgets */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {currentWidget ? 'Edit Widget' : 'Create Widget'}
                    </h3>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Widget Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                      Color
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="color"
                        name="color"
                        id="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="h-8 w-8 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="ml-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                      Position
                    </label>
                    <select
                      name="position"
                      id="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="welcomeMessage" className="block text-sm font-medium text-gray-700">
                      Welcome Message
                    </label>
                    <textarea
                      name="welcomeMessage"
                      id="welcomeMessage"
                      rows="3"
                      value={formData.welcomeMessage}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    ></textarea>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {currentWidget ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Widgets; 
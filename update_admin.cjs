const fs = require('fs');
const content = fs.readFileSync('src/pages/Admin.tsx', 'utf-8');

let newContent = content.replace(
  "  const { currentUser, books, comments, addBook, updateBook, deleteBook } = useAppContext();",
  "  const { currentUser, books, comments, addBook, updateBook, deleteBook, getAllUsers, updateUserRole } = useAppContext();\n  const [activeTab, setActiveTab] = useState<'books' | 'users'>('books');\n  const allUsers = getAllUsers();"
);

newContent = newContent.replace(
  '      <div className="mb-8 flex justify-between items-end">',
  `      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('books')}
          className={\`pb-4 font-medium text-sm transition-colors relative \${activeTab === 'books' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}\`}
        >
          Кітаптар
          {activeTab === 'books' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={\`pb-4 font-medium text-sm transition-colors relative \${activeTab === 'users' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}\`}
        >
          Пайдаланушылар
          {activeTab === 'users' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-t-full" />
          )}
        </button>
      </div>

      {activeTab === 'users' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Пайдаланушыларды басқару</h2>
            <p className="text-sm text-gray-500 mt-1">Осы жерден пайдаланушыларға админ құқығын бере аласыз.</p>
          </div>
          <div className="divide-y divide-gray-100">
            {allUsers.map(user => (
              <div key={user.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={\`text-xs font-bold px-2 py-1 rounded-full \${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}\`}>
                    {user.role === 'admin' ? 'Админ' : 'Пайдаланушы'}
                  </span>
                  {user.id !== currentUser?.id && (
                    <button
                      onClick={() => updateUserRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {user.role === 'admin' ? 'Админ құқығын алу' : 'Админ ету'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
      <div className="mb-8 flex justify-between items-end">`
);

newContent = newContent.replace(
  '          )}        </div>      </div>    </div>  );}',
  '          )}        </div>      </div>      </>      )}    </div>  );}'
);

fs.writeFileSync('src/pages/Admin.tsx', newContent);

// 请优化以下React组件，解决性能问题并说明优化原理

import { useState, useEffect } from 'react';

function UserList({ users, onUserSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, filtered: 0 });

  // 过滤用户
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // 排序用户
  const sortedUsers = filteredUsers.sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'email') {
      return a.email.localeCompare(b.email);
    } else if (sortBy === 'role') {
      return a.role.localeCompare(b.role);
    }
    return 0;
  });

  // 更新统计信息
  useEffect(() => {
    setStats({
      total: users.length,
      filtered: filteredUsers.length
    });
  }, [users.length, filteredUsers.length]);

  // 切换用户选择状态
  const handleUserToggle = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
    onUserSelect && onUserSelect(userId);
  };

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedUsers.length === sortedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(sortedUsers.map(user => user.id));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="搜索用户..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <select 
          value={filterRole} 
          onChange={(e) => setFilterRole(e.target.value)}
          style={{ marginRight: '10px', padding: '8px' }}
        >
          <option value="all">所有角色</option>
          <option value="admin">管理员</option>
          <option value="user">普通用户</option>
          <option value="guest">访客</option>
        </select>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: '8px' }}
        >
          <option value="name">按姓名排序</option>
          <option value="email">按邮箱排序</option>
          <option value="role">按角色排序</option>
        </select>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleSelectAll} style={{ marginRight: '10px' }}>
          {selectedUsers.length === sortedUsers.length ? '取消全选' : '全选'}
        </button>
        <span>总计: {stats.total} | 筛选后: {stats.filtered}</span>
      </div>
      {/* useMemo useCallbak  cahce {user.id:zujian}*/}
      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {sortedUsers.map(user => (
          <UserCard 
            key={user.id} 
            user={user}
            isSelected={selectedUsers.includes(user.id)}
            onToggle={handleUserToggle}
            onEdit={() => console.log('编辑用户:', user.id)}
            metadata={{ searchTerm, sortBy, filterRole }}
          />
        ))}
      </div>
    </div>
  );
}

function UserCard({ user, isSelected, onToggle, onEdit, metadata }) {

  
  // 高亮搜索关键词
  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.split(regex).map((part, index) => 
      regex.test(part) ? <mark key={index}>{part}</mark> : part
    );
  };

  return (
    <div 
      style={{ 
        padding: '15px', 
        marginBottom: '10px', 
        border: `2px solid ${isSelected ? 'blue' : '#ddd'}`,
        borderRadius: '8px',
        backgroundColor: isSelected ? '#f0f8ff' : 'white'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input 
          type="checkbox" 
          checked={isSelected}
          onChange={() => onToggle(user.id)}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
            {highlightText(user.name, metadata.searchTerm)}
          </div>
          <div style={{ color: '#666', fontSize: '14px' }}>
            {highlightText(user.email, metadata.searchTerm)}
          </div>
          <div style={{ 
            display: 'inline-block', 
            padding: '2px 8px', 
            borderRadius: '4px',
            backgroundColor: user.role === 'admin' ? '#ff6b6b' : 
                           user.role === 'user' ? '#4ecdc4' : '#95e1d3',
            color: 'white',
            fontSize: '12px',
            marginTop: '5px'
          }}>
            {user.role}
          </div>
        </div>
        <button 
          onClick={() => onEdit(user.id)}
          style={{ padding: '5px 10px' }}
        >
          编辑
        </button>
      </div>
    </div>
  );
}


// 使用示例
function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // 模拟大量数据
    const mockUsers = Array.from({ length: 10000 }, (_, i) => ({
      id: i + 1,
      name: `用户${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: ['admin', 'user', 'guest'][i % 3]
    }));
    setUsers(mockUsers);
  }, []);

  const handleUserSelect = (userId) => {
    console.log('用户被选中:', userId);
  };

  return <UserList users={users} onUserSelect={handleUserSelect} />;
}


// 优化原理：

// useMemo缓存过滤排序计算，避免重复渲染时重复计算

// useCallback缓存事件处理函数，防止子组件不必要重渲染

// memo包裹UserCard组件，只有props变化时才重新渲染

// 移除metadata对象，传递原始searchTerm避免每次创建新对象

// 将stats计算合并到useMemo中，移除不必要的useEffect

// 排序前复制数组（[...filtered]），避免修改原数组

// 将highlightText函数移到UserCard内部并用useCallback包装

// 虚拟滚动/canvas
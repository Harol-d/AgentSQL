import React from 'react';

const ChatBubble = ({ message, onOpenModal }) => {
  const { id, type, content, time } = message;

  return (
    <div
      key={id}
      className={`chat-bubble ${type}`}
      onClick={type === 'system' ? () => onOpenModal(message) : undefined}
      style={type === 'system' ? { cursor: 'pointer' } : {}}
    >
      {type === 'user' ? (
        <div className="bubble-user">
          <div className="bubble-content">{content}</div>
          <div className="bubble-time">{time}</div>
        </div>
      ) : (
        <div className="bubble-system">
          <div className="bubble-header">
            <i className="fas fa-database"></i>
          </div>
          <div className="bubble-content">
            {content.split('```sql').length > 1 ? (
              <>
                {content.split('```sql')[0].split('\n').map((line, i) => <div key={i}>{line}</div>)}
                <pre className="sql-block">
                  {content.split('```sql')[1].replace('```','').trim()}
                </pre>
              </>
            ) : (
              content
            )}
          </div>
          <div className="bubble-time">{time}</div>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;

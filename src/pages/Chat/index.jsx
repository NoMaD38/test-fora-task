import React, { useState } from 'react';
import socket from '../../socket';
import StateContext from '../../rootContext';

export const Chat = () => {
	const { users, nickname, roomId, messages, addMessage} = React.useContext(StateContext);

	const [ messagesValue, setMessagesValue ] = useState('');
	const sendMessage = () => {

        function getTime(time){
            var date = new Date(parseInt(time));
            var time = date.toLocaleTimeString();
            return time.replace(/:\d+ /, ' ');
        }

        let time = getTime(Date.now())

        socket.emit('ROOM:NEW-MESSAGE', {
            roomId,
            nickname,
            time,
            text: messagesValue
        });
        addMessage({
            nickname,
            time,
            text: messagesValue
        })
        setMessagesValue('');
	};
	return (
		<div className="chat">
			<div className="chat-users">
				<b>Users ({users.length}): </b>
				<ul>{users.map((user, index) => <li key={`user_${index}`} className={nickname === user ? "chat-user-block-active" : "chat-user-block"}>{user}</li>)}</ul>
			</div>
			<div className="chat-messages">
				<div className="messages">
					{messages.map((message, index) => (
						<div className="message" key={`message_${index}`}>
							<p>{message.text} <sup>{message.time}</sup></p>
							<div>
								<span>{message.nickname}</span>
							</div>
						</div>
					))}
				</div>
				<form>
					<textarea value={messagesValue} onChange={(e) => setMessagesValue(e.target.value)} rows="3" />
					<button onClick={sendMessage} type="button">
						Send
					</button>
				</form>
			</div>
		</div>
	);
};

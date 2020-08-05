import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import RoomList from './RoomList';
import UserList from './UserList';
import socket from '../../socket';
import StateContext from '../../rootContext';

export const Chat = (props) => {
	const { users, nickname, roomId, messages, addMessage, rooms, onReJoin } = React.useContext(StateContext);
	const [ isConnect, setIsConnect ] = useState(false);
	const [ isListVisible, setListVisible ] = useState(false);
	const [ messagesValue, setMessagesValue ] = useState('');
	const location = useLocation();

	React.useEffect(
		() => {
			if (isConnect) {
				onReJoin({ roomId: props.match.params.roomId, oldRoomId: roomId, nickname });
			}
			setIsConnect(true);
		},
		[ location ]
	);

	// Добавляем новое сообщение
	const sendMessage = () => {
		function getTime(time) {
			var date = new Date(parseInt(time));
			var new_time = date.toLocaleTimeString();
			return new_time.replace(/:\d+ /, ' ');
		}

		let time = getTime(Date.now());

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
		});
		setMessagesValue('');
	};
	return (
		<div className="container">
			<div className="row m-3 border" >
				<div className="col-3 p-2 bg-light" style={{height:'700px'}}>
					Комната <b>{roomId}</b>
					<div className="btn-group">
						<button
							type="button"
							className={`btn ${!isListVisible ? 'btn-success' : 'btn-light'}`}
							onClick={() => setListVisible(false)}
						>
							Rooms
						</button>
						<button
							type="button"
							className={`btn ${isListVisible ? 'btn-success' : 'btn-light'}`}
							onClick={() => setListVisible(true)}
						>
							Users
						</button>
					</div>
					{!isListVisible ? (
						<RoomList rooms={rooms} roomId={roomId} />
					) : (
						<UserList users={users} nickname={nickname} />
					)}
				</div>

				<div className="col-9 shadow-sm p-2" style={{height:'700px'}}>
						<div className="messages overflow-auto" style={{minHeight:'540px', maxHeight:'540px'}}>
							{messages.map((message, index) => (
								<div key={`message_${index}`}>
									<div>
										<span>{message.nickname}</span>
									</div>
									<div className='d-inline-flex bg-info p-2 rounded-lg text-white'>{message.text}</div>
									<div>{message.time}</div>
								</div>
							))}
						</div>
						<form style={{height:'160px'}}>
							<textarea
								className="form-control m-2"
								rows="3"
								onChange={(e) => setMessagesValue(e.target.value)}
								value={messagesValue}
							/>
							<button type="button" className="btn btn-primary m-2" onClick={sendMessage}>
								Send
							</button>
						</form>
				</div>
			</div>
		</div>
	);
};

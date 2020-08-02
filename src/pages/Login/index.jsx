import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import StateContext from '../../rootContext';

export const Login = () => {
	const {onJoin} = React.useContext(StateContext);
	let history = useHistory();
	const [ nickname, setNickname ] = useState('');
	const [ isLoading, setIsLoading ] = useState(false);

	const singIN = async () => {
		setIsLoading(true);
		const user = {
			roomId: '2',
			nickname
		};
		await fetch('/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(user)
		}).then(() => {
			setIsLoading(false);
			history.push("/chat/" + user.roomId);
			onJoin(user);
		});
	};

	return (
		<div>
			<div>
				<input
					type="text"
					placeholder="Nickname"
					value={nickname}
					onChange={(e) => setNickname(e.target.value)}
				/>
			</div>
			<button disabled={isLoading} onClick={singIN}>
				{isLoading ? 'Loading...' : 'JOIN US'}
			</button>
		</div>
	);
};

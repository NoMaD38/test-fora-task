import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import StateContext from '../../rootContext';

export const Login = () => {
	const {onJoin} = React.useContext(StateContext);
	let history = useHistory();
	const [ nickname, setNickname ] = useState('');
	const [ isLoading, setIsLoading ] = useState(false);

	// Создаём нового пользователя и заходим в комнату
	const singIN = async () => {
		setIsLoading(true);
		const user = {
			roomId: Date.now().toString(),
			nickname
		};
		await fetch('/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(user)
		}).then(() => {
			setIsLoading(false);
			onJoin(user);
			history.push("/chat/" + user.roomId);
		});
	};

	return (
		<div className="container">
			<div className="row align-items-center" style={{height:'100vh'}}>
				<div className="col-md-4 offset-md-4 border shadow-sm p-3 mb-5 rounded">
				<p className="h1 text-center" style={{fontWeight:300}}>FORA CHAT</p>
					<form>
						<div className="form-group">
							<label>Nickname</label>
							<input
								className="form-control"
								type="text"
								name="nickname"
								value={nickname}
								onChange={(e) => setNickname(e.target.value)}
							/>
							<small className="form-text text-muted">Nickname displayed in chat</small>
							<button type="button" disabled={isLoading} className="btn btn-primary mt-2" onClick={singIN}>
								{isLoading ? 'Loading...' : 'JOIN'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

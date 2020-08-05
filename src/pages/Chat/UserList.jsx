import React from 'react';

export default function ListOfUsers({ users, nickname }) {
	return (
		<div>
			<b>Users ({users.length}): </b>
			<ul>
				{users.map((user, index) => (
                    <div key={`user_${index}`} className={nickname === user? 'btn bg-primary' : 'btn bg-light'} >{user}</div>
				))}
			</ul>
		</div>
	);
}

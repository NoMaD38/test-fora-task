import React from 'react';
import { Link } from 'react-router-dom';

export default function ListOfRooms({ rooms, roomId }) {
	return (
		<div>
			<b>Rooms ({rooms.length}): </b>
			<ul>
				{rooms.map((room, index) => (
					<Link key={`room_${index}`} to={'/chat/' + room}>
                        <button type="button" className={room === roomId ? 'btn bg-primary' : 'btn bg-light'} >{room}</button>
					</Link>
				))}
			</ul>
		</div>
	);
}

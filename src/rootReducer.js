export default (state, action) =>{
    switch (action.type) {
        case 'JOINED':
            return {
                ...state,
                joined: true,
                roomId: action.payload.roomId,
                nickname: action.payload.nickname
            };

        case 'SET_USERS':
            return {
                ...state,
                users: action.payload
            };

        case 'SET_MESSAGES':
            return {
                ...state,
                messages: [...state.messages, action.payload]
            };

        default:{
            return state;
        }
    }
} 
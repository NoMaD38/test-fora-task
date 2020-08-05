export default (state, action) =>{
    switch (action.type) {
        case 'JOINED':
            return {
                ...state,
                joined: true,
                roomId: action.payload.roomId,
                nickname: action.payload.nickname
            };
        case 'REJOINED':
            return {
                ...state,
                roomId: action.payload.roomId,
            };
        case 'SET_USERS':
            return {
                ...state,
                users: action.payload
            };

        case 'SET_ROOMS':
            return {
                ...state,
                rooms: action.payload
            };

        case 'ADD_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload]
            };
        case 'SET_MESSAGES':
            return {
                ...state,
                messages:  action.payload
            };

        default:{
            return state;
        }
    }
} 
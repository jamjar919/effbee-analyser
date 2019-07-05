import type{ Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type networkType = {
    showRoot: boolean
}

export type facebookType = {
    profileApi: object,
    messageApi: object,
    friendsApi: object
}

export type selectionType = {
    type: string,
    selection: object
}

export type stateType = {
    +counter: number,
    network: networkType,
    facebook: facebookType
};

export type Action = {
    +type: string,
    payload: object
};

export type GetState = () => stateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;

export type messageType = ([{
    sender_name: string,
    content: string,
    timestamp_ms: integer, 
    type: string
}])
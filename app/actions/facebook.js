export const REFRESH_API = 'REFRESH_API';
export function refreshFacebookApiAction(dispatch) {
    return () => dispatch({
        type: REFRESH_API
    });
}
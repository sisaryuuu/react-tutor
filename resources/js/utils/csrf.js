// Reads a cookie value by name. Laravel sets XSRF-TOKEN after a request
// to /sanctum/csrf-cookie. fetch (unlike axios) doesn't automatically
// turn this into a request header, so we do it ourselves and reuse
// this helper anywhere we make a POST/PUT/DELETE request while logged in.
export function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}
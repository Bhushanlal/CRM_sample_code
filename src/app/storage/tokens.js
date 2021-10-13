

export function getToken() {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('ACCESS_TOKEN');
        return token;
    }

}

export function setToken(token) {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.setItem('ACCESS_TOKEN', token);
        return token;
    }
}

export function removeLocalData() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('typeData');
        localStorage.removeItem('entityData');
        return true;
    }
}

export function getVerifyToken() {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('VERIFY_TOKEN');
        return token;
    }
}

export function setVerifyToken(token) {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('VERIFY_TOKEN');
        localStorage.setItem('VERIFY_TOKEN', token);
        return token;
    }
}
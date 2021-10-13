export function setUserDetails(data) {
    localStorage.setItem('typeData', btoa(JSON.stringify(data)));
}

export const getUserDetails = () => {
    if (localStorage.getItem('typeData') === null) {
        return '';
    }
    try {
        const userData = JSON.parse(atob(localStorage.getItem('typeData')));
        return userData;
    } catch (e) {
        return
    }
}

export function setEntityData(data) {
    localStorage.setItem('entityData', btoa(JSON.stringify(data)));
}

export const getEntityData = () => {
    if (localStorage.getItem('entityData') === null) {
        return '';
    }
    try {
        const userData = JSON.parse(atob(localStorage.getItem('entityData')));
        return userData;
    } catch (e) {
        return
    }
}
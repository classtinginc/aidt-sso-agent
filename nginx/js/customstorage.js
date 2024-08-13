class LocalStorageDTO {
    constructor() {
        this.storage = {};
        this.init();
    }

    init() {
        // 기존 데이터를 로드 (localStorage에 저장된 데이터가 있을 경우)
        const savedData = localStorage.getItem('localStorageDTO');
        if (savedData) {
            this.storage = JSON.parse(savedData);
        }

        // 페이지가 로드될 때 현재 탭 ID를 localStorage에 저장된 탭 ID 목록에 추가
        const currentTabId = new Date().getTime().toString();
        sessionStorage.setItem('currentTabId', currentTabId);
        const allTabIds = JSON.parse(localStorage.getItem('tabIds')) || [];
        allTabIds.push(currentTabId);
        localStorage.setItem('tabIds', JSON.stringify(allTabIds));

        // beforeunload 이벤트 핸들러 등록
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('isRefresh', 'true');
        });

        // unload 이벤트 핸들러 등록
        window.addEventListener('unload', () => {
            if (sessionStorage.getItem('isRefresh') === 'true') {
                sessionStorage.removeItem('isRefresh');
                return;
            }

            const allTabIds = JSON.parse(localStorage.getItem('tabIds')) || [];
            const newTabIds = allTabIds.filter(id => id !== currentTabId);
            localStorage.setItem('tabIds', JSON.stringify(newTabIds));

            if (newTabIds.length === 0) {
                localStorage.removeItem('localStorageDTO');
            }
        });
    }

    setItem(key, value) {
        this.storage[key] = value;
        this.syncToLocalStorage();
    }

    getItem(key) {
        return this.storage[key];
    }

    removeItem(key) {
        delete this.storage[key];
        this.syncToLocalStorage();
    }

    clear() {
        this.storage = {};
        this.syncToLocalStorage();
    }

    syncToLocalStorage() {
        localStorage.setItem('localStorageDTO', JSON.stringify(this.storage));
    }
}

// 사용 예제
//const myStorage = new LocalStorageDTO();
//myStorage.setItem('name', 'John Doe');
//console.log(myStorage.getItem('name')); // "John Doe"
//myStorage.removeItem('name');
//myStorage.clear();
